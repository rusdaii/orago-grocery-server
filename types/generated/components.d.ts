import type { Schema, Attribute } from '@strapi/strapi';

export interface OrderedItemOrderedItem extends Schema.Component {
  collectionName: 'components_ordered_item_ordered_items';
  info: {
    displayName: 'Ordered-item';
    description: '';
  };
  attributes: {
    quantity: Attribute.BigInteger;
    price: Attribute.BigInteger;
    product: Attribute.Relation<
      'ordered-item.ordered-item',
      'oneToOne',
      'api::product.product'
    >;
    productName: Attribute.String;
    image: Attribute.String;
    slug: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'ordered-item.ordered-item': OrderedItemOrderedItem;
    }
  }
}
