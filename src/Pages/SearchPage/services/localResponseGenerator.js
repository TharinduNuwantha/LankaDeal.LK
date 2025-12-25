// myapp/src/services/localResponseGenerator.js

// Check if question can be answered locally without API
export const canAnswerLocally = (userMsg) => {
  const msg = userMsg.toLowerCase();
  
  const localPatterns = [
    /cheap/i, /expensive/i, /price/i, /cost/i,
    /compare/i, /difference/i, /better/i,
    /stock/i, /available/i,
    /delivery/i, /shipping/i, /fast/i,
    /total/i, /sum/i, /all together/i,
    /recommend/i, /suggest/i, /best/i,
    /discount/i, /sale/i, /offer/i
  ];

  return localPatterns.some(pattern => pattern.test(msg));
};

// Generate response using local logic
export const generateLocalResponse = (userMsg, products) => {
  const msg = userMsg.toLowerCase();

  if (products.length === 0) {
    return {
      canAnswer: true,
      response: "You haven't added any products yet. Click 'Add to Chat' on any product to start discussing it with me!",
      productLinks: []
    };
  }

  // Price comparisons
  if (msg.includes("cheap") || msg.includes("least") || msg.includes("lowest")) {
    return generateCheapestResponse(products);
  }

  if (msg.includes("expensive") || msg.includes("most") || msg.includes("highest") && msg.includes("price")) {
    return generateMostExpensiveResponse(products);
  }

  // Compare products
  if (msg.includes("compare") && products.length > 1) {
    return generateComparisonResponse(products);
  }

  // Total price
  if (msg.includes("total") || (msg.includes("all") && msg.includes("together"))) {
    return generateTotalPriceResponse(products);
  }

  // Stock availability
  if (msg.includes("stock") || msg.includes("available")) {
    return generateStockResponse(products);
  }

  // Delivery info
  if (msg.includes("delivery") || msg.includes("shipping")) {
    return generateDeliveryResponse(products);
  }

  // Discount info
  if (msg.includes("discount") || msg.includes("sale") || msg.includes("offer")) {
    return generateDiscountResponse(products);
  }

  // Recommendation
  if (msg.includes("recommend") || msg.includes("suggest") || msg.includes("best")) {
    return generateRecommendationResponse(products);
  }

  // Product details
  if (msg.includes("detail") || msg.includes("info") || msg.includes("tell me more")) {
    return generateDetailsResponse(products);
  }

  return { canAnswer: false };
};

const generateCheapestResponse = (products) => {
  const cheapest = products.reduce((min, p) => 
    parseFloat(p.price) < parseFloat(min.price) ? p : min
  );

  let response = `The cheapest product is **${cheapest.title}** at Rs. ${cheapest.price}. `;
  
  if (cheapest.discount) {
    response += `It has a ${cheapest.discount} discount! `;
  }
  
  response += `\n\n${cheapest.inStock ? '✅ In stock' : '❌ Out of stock'}`;
  response += `\n${cheapest.fastDelivery ? '🚀 Fast delivery available' : '📦 Standard delivery'}`;

  return {
    canAnswer: true,
    response,
    productLinks: [{ id: cheapest.id, title: cheapest.title, categoryPath: cheapest.categoryPath }]
  };
};

const generateMostExpensiveResponse = (products) => {
  const expensive = products.reduce((max, p) => 
    parseFloat(p.price) > parseFloat(max.price) ? p : max
  );

  let response = `The most expensive product is **${expensive.title}** at Rs. ${expensive.price}. `;
  response += `\n\n${expensive.inStock ? '✅ In stock' : '❌ Out of stock'}`;
  response += `\n${expensive.fastDelivery ? '🚀 Fast delivery available' : '📦 Standard delivery'}`;

  return {
    canAnswer: true,
    response,
    productLinks: [{ id: expensive.id, title: expensive.title, categoryPath: expensive.categoryPath }]
  };
};

const generateComparisonResponse = (products) => {
  let response = "Here's a detailed comparison of your selected products:\n\n";
  const productLinks = [];

  products.forEach((p, idx) => {
    response += `**${idx + 1}. ${p.title}**\n`;
    response += `💰 Price: Rs. ${p.price}`;
    if (p.originalPrice) {
      response += ` (was Rs. ${p.originalPrice}, save ${p.discount})`;
    }
    response += `\n`;
    response += `📦 Stock: ${p.inStock ? 'In Stock' : 'Out of Stock'}\n`;
    response += `🚚 Delivery: ${p.fastDelivery ? 'Fast (2-3 days)' : 'Standard (5-7 days)'}\n`;
    if (p.rating && p.rating !== '0') {
      response += `⭐ Rating: ${p.rating}/5 (${p.reviewCount} reviews)\n`;
    }
    response += `\n`;

    productLinks.push({ id: p.id, title: p.title, categoryPath: p.categoryPath });
  });

  // Add recommendation
  const inStock = products.filter(p => p.inStock);
  if (inStock.length > 0) {
    const best = inStock.reduce((min, p) => 
      parseFloat(p.price) < parseFloat(min.price) ? p : min
    );
    response += `\n💡 **Recommendation:** ${best.title} offers the best value at Rs. ${best.price} and is currently in stock!`;
  }

  return {
    canAnswer: true,
    response,
    productLinks
  };
};

const generateTotalPriceResponse = (products) => {
  const total = products.reduce((sum, p) => sum + parseFloat(p.price), 0);
  const originalTotal = products.reduce((sum, p) => 
    sum + parseFloat(p.originalPrice || p.price), 0
  );
  const savings = originalTotal - total;

  let response = `The total for all ${products.length} selected products is **Rs. ${total.toFixed(2)}**.\n\n`;
  
  if (savings > 0) {
    response += `💰 You're saving Rs. ${savings.toFixed(2)} in total!\n\n`;
  }

  response += "Breakdown:\n";
  products.forEach((p, idx) => {
    response += `${idx + 1}. ${p.title}: Rs. ${p.price}\n`;
  });

  return {
    canAnswer: true,
    response,
    productLinks: products.map(p => ({ id: p.id, title: p.title, categoryPath: p.categoryPath }))
  };
};

const generateStockResponse = (products) => {
  const inStock = products.filter(p => p.inStock);
  const outOfStock = products.filter(p => !p.inStock);

  let response = "";
  const productLinks = [];

  if (inStock.length === products.length) {
    response = `✅ Great news! All ${products.length} products are in stock and ready to ship!\n\n`;
    inStock.forEach((p, idx) => {
      response += `${idx + 1}. ${p.title} - ${p.stockCount || 'Multiple'} units available\n`;
      productLinks.push({ id: p.id, title: p.title, categoryPath: p.categoryPath });
    });
  } else if (inStock.length > 0) {
    response = `${inStock.length} out of ${products.length} products are in stock:\n\n`;
    response += "✅ **In Stock:**\n";
    inStock.forEach((p, idx) => {
      response += `${idx + 1}. ${p.title}\n`;
      productLinks.push({ id: p.id, title: p.title, categoryPath: p.categoryPath });
    });
    response += "\n❌ **Out of Stock:**\n";
    outOfStock.forEach((p, idx) => {
      response += `${idx + 1}. ${p.title}\n`;
    });
  } else {
    response = `❌ Unfortunately, all selected products are currently out of stock. Would you like me to help you find alternatives?`;
  }

  return {
    canAnswer: true,
    response,
    productLinks
  };
};

const generateDeliveryResponse = (products) => {
  const fastDelivery = products.filter(p => p.fastDelivery);
  const standardDelivery = products.filter(p => !p.fastDelivery);

  let response = "";
  const productLinks = [];

  if (fastDelivery.length === products.length) {
    response = `🚀 Excellent! All ${products.length} products qualify for fast delivery (2-3 business days)!\n\n`;
    fastDelivery.forEach((p, idx) => {
      response += `${idx + 1}. ${p.title}\n`;
      productLinks.push({ id: p.id, title: p.title, categoryPath: p.categoryPath });
    });
  } else if (fastDelivery.length > 0) {
    response = `Delivery options for your products:\n\n`;
    response += `🚀 **Fast Delivery (2-3 days):**\n`;
    fastDelivery.forEach((p, idx) => {
      response += `${idx + 1}. ${p.title}\n`;
      productLinks.push({ id: p.id, title: p.title, categoryPath: p.categoryPath });
    });
    response += `\n📦 **Standard Delivery (5-7 days):**\n`;
    standardDelivery.forEach((p, idx) => {
      response += `${idx + 1}. ${p.title}\n`;
    });
  } else {
    response = `📦 All products have standard delivery (5-7 business days).`;
  }

  return {
    canAnswer: true,
    response,
    productLinks
  };
};

const generateDiscountResponse = (products) => {
  const withDiscount = products.filter(p => p.discount && p.discount !== '0%');

  let response = "";
  const productLinks = [];

  if (withDiscount.length === 0) {
    response = "Currently, none of the selected products have active discounts.";
  } else {
    response = `🎉 ${withDiscount.length} product${withDiscount.length > 1 ? 's have' : ' has'} active discounts!\n\n`;
    withDiscount.forEach((p, idx) => {
      const savings = parseFloat(p.originalPrice) - parseFloat(p.price);
      response += `${idx + 1}. **${p.title}**\n`;
      response += `   ${p.discount} OFF - Save Rs. ${savings.toFixed(2)}\n`;
      response += `   Price: Rs. ${p.price} (was Rs. ${p.originalPrice})\n\n`;
      productLinks.push({ id: p.id, title: p.title, categoryPath: p.categoryPath });
    });

    const totalSavings = withDiscount.reduce((sum, p) => 
      sum + (parseFloat(p.originalPrice || p.price) - parseFloat(p.price)), 0
    );
    response += `💰 Total savings: Rs. ${totalSavings.toFixed(2)}`;
  }

  return {
    canAnswer: true,
    response,
    productLinks
  };
};

const generateRecommendationResponse = (products) => {
  if (products.length === 1) {
    const p = products[0];
    let response = `You've selected **${p.title}**. `;
    
    if (p.inStock && p.fastDelivery) {
      response += "This is a great choice! It's in stock and offers fast delivery. 🚀";
    } else if (p.inStock) {
      response += "This product is in stock and ready to ship! 📦";
    } else {
      response += "Unfortunately, this item is currently out of stock. Would you like me to help find alternatives?";
    }

    return {
      canAnswer: true,
      response,
      productLinks: [{ id: p.id, title: p.title, categoryPath: p.categoryPath }]
    };
  }

  const inStock = products.filter(p => p.inStock);
  
  if (inStock.length === 0) {
    return {
      canAnswer: true,
      response: "Unfortunately, all selected products are out of stock. I recommend checking back later or exploring similar products.",
      productLinks: []
    };
  }

  const fastDelivery = inStock.filter(p => p.fastDelivery);
  let best;

  if (fastDelivery.length > 0) {
    best = fastDelivery.reduce((min, p) => 
      parseFloat(p.price) < parseFloat(min.price) ? p : min
    );
  } else {
    best = inStock.reduce((min, p) => 
      parseFloat(p.price) < parseFloat(min.price) ? p : min
    );
  }

  let response = `💡 Based on your selection, I recommend **${best.title}** for the following reasons:\n\n`;
  response += `✅ Best value at Rs. ${best.price}\n`;
  response += `✅ Currently in stock\n`;
  if (best.fastDelivery) {
    response += `✅ Fast delivery available (2-3 days)\n`;
  }
  if (best.discount) {
    response += `✅ ${best.discount} discount!\n`;
  }

  return {
    canAnswer: true,
    response,
    productLinks: [{ id: best.id, title: best.title, categoryPath: best.categoryPath }]
  };
};

const generateDetailsResponse = (products) => {
  let response = "Here are the complete details for your selected products:\n\n";
  const productLinks = [];

  products.forEach((p, idx) => {
    response += `**${idx + 1}. ${p.title}**\n`;
    response += `${p.description}\n\n`;
    response += `💰 Price: Rs. ${p.price}`;
    if (p.originalPrice) {
      response += ` (${p.discount} off from Rs. ${p.originalPrice})`;
    }
    response += `\n`;
    response += `📦 Stock: ${p.inStock ? `In Stock (${p.stockCount || 'Available'})` : 'Out of Stock'}\n`;
    response += `🚚 Delivery: ${p.fastDelivery ? 'Fast (2-3 days)' : 'Standard (5-7 days)'}\n`;
    response += `📂 Category: ${p.categoryPath?.split('/')[1]?.replace(/_/g, ' ') || 'N/A'}\n`;
    if (p.rating && p.rating !== '0') {
      response += `⭐ Rating: ${p.rating}/5 (${p.reviewCount} reviews)\n`;
    }
    response += `\n`;

    productLinks.push({ id: p.id, title: p.title, categoryPath: p.categoryPath });
  });

  return {
    canAnswer: true,
    response,
    productLinks
  };
};