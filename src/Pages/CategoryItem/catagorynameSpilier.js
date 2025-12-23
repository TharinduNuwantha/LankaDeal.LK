const extractCategoryFromPath = (fullPath) => {
  // Split the path by "/"
  const segments = fullPath.split('/');
  
  // Get the second segment (index 1) if it exists
  const targetSegment = segments.length > 1 ? segments[1] : '';
  
  // Replace underscores with spaces
  const formatted = targetSegment.replace(/_/g, ' ');
  
  return formatted;
};
export default extractCategoryFromPath

