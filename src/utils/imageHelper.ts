/**
 * Generate a slug from a name for use in image URLs
 */
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Get image URL for an ingredient or appliance
 */
export const getItemImageUrl = (name: string): string => {
  const slug = generateSlug(name);
  return `https://picsum.photos/seed/${slug}/120/120`;
};
