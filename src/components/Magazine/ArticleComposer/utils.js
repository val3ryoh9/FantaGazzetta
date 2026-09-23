import { uid } from "../../../utils/utils";

export const createArticle = (values, imageData) => ({
  id: uid(),
  title: values.title.trim(),
  author: (values.author || "Admin").trim() || "Admin",
  excerpt: (values.excerpt || "").trim() || values.body.slice(0, 140),
  body: values.body.trim(),
  image: imageData,
  date: new Date().toISOString(),
});
