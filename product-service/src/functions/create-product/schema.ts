export default {
  type: "object",
  properties: {
    title: { type: 'string', minLength: 1 },
    description: { type: 'string', minLength: 1},
    price: { type: 'integer', minimum: 1 },
    image_url: { type: 'string', minLength: 1 },
    count: { type: 'integer', minimum: 0 }
  },
  required: ['title', 'description', 'price', 'image_url', 'count']
} as const;
