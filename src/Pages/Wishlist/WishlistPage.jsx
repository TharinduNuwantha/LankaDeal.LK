import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { wishlistSelecter, userSelecter } from '../../Store/ReduxSlice/userClise';
import { toggleWishlist } from '../../utils/Wishlist/toggleWishlist';
import { addToCart } from '../../utils/AddToCart/addToCart';
import {
    Heart, ShoppingCart, Trash2, ArrowLeft,
    ShoppingBag, Star, Zap, Clock
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const WishlistPage = () => {
    const wishlist = useSelector(wishlistSelecter);
    const userData = useSelector(userSelecter);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleRemove = async (product) => {
        try {
            await toggleWishlist(userData.uid, product, wishlist, dispatch);
            toast.success(`Removed ${product.title} from wishlist`, {
                position: "bottom-center",
                style: { borderRadius: '12px', background: '#111827', color: '#fff' }
            });
        } catch (error) {
            toast.error("Failed to remove item");
        }
    };

    const handleAddToCart = (product) => {
        if (!userData || !userData.uid) {
            toast.warning("Please login first!");
            return;
        }
        const productWithQuantity = { ...product, quantity: 1 };
        addToCart(userData.uid, productWithQuantity, userData.cart || [], dispatch);
        toast.success(`Added ${product.title} to cart!`, {
            position: "bottom-center"
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-800 text-white shadow-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-red-100 hover:text-white transition-colors mb-6 group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Back to Shopping
                    </button>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-extrabold flex items-center gap-4 tracking-tight">
                                <Heart className="w-10 h-10 lg:w-12 lg:h-12 fill-white animate-pulse" />
                                My Wishlist
                            </h1>
                            <p className="text-red-100 mt-3 text-lg font-medium opacity-90">
                                {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
                {wishlist.length === 0 ? (
                    <div className="bg-white rounded-[2rem] shadow-2xl p-16 text-center border border-gray-100 max-w-2xl mx-auto">
                        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <Heart className="w-12 h-12 text-red-400 opacity-50" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Your wishlist is empty</h3>
                        <p className="text-gray-500 text-lg mb-10 max-w-sm mx-auto leading-relaxed">
                            Looks like you haven't saved anything yet. Start exploring our premium collection!
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="px-10 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-red-200 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3 mx-auto"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            Go Shopping
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {wishlist.map((product) => (
                            <div
                                key={product.id}
                                className="group bg-white rounded-[2rem] shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col border border-gray-100/50 hover:-translate-y-2"
                            >
                                {/* Image Section */}
                                <div className="relative aspect-square overflow-hidden bg-gray-50">
                                    <img
                                        src={product.imageUrl}
                                        alt={product.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => handleRemove(product)}
                                        className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm shadow-xl rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all transform hover:rotate-90 active:scale-90"
                                        title="Remove item"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>

                                    <div className="absolute bottom-4 left-4">
                                        <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-xs font-bold text-gray-900 rounded-full shadow-lg border border-white/20 flex items-center gap-1.5">
                                            <Clock className="w-3 h-3 text-red-500" />
                                            Saved
                                        </span>
                                    </div>
                                </div>

                                {/* Info Section */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-1 mb-2">
                                        {[1, 2, 3, 4].map(i => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                                        <Star className="w-3 h-3 text-gray-300" />
                                    </div>

                                    <h4 className="font-bold text-gray-900 line-clamp-2 mb-3 leading-tight group-hover:text-red-600 transition-colors">
                                        {product.title}
                                    </h4>

                                    <div className="mt-auto pt-4">
                                        <div className="flex items-center justify-between gap-4">
                                            <div>
                                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Price</p>
                                                <p className="text-2xl font-black text-gray-900 tracking-tight">
                                                    Rs. {Number(product.price).toLocaleString()}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-red-100 hover:shadow-red-200 hover:scale-110 active:scale-90 transition-all group/btn"
                                            >
                                                <ShoppingCart className="w-5 h-5 transition-transform group-hover/btn:scale-110" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer Info */}
            <div className="bg-white border-t border-gray-100 py-10 mt-auto">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-400 text-sm font-medium">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span>Save items to receive exclusive price drop alerts!</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WishlistPage;
