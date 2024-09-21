import { CollectionConfig } from 'payload/types';
import ProductsSliderBlock from '../../blocks/products-slider';
import TimeRangePickerField from '../../fields/time-range-picker';
import autoFillFieldsFromCRM from './hooks/autoFillFieldsFromCRM';
import { slugField } from '../../fields/slug';
import { admins } from '../../access/admins';

const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: {
      en: 'Product',
      ru: 'Продукт',
      pl: 'Produkt',
      uk: 'Продукт',
    },
    plural: {
      en: 'Products',
      ru: 'Продукты',
      pl: 'Produkty',
      uk: 'Продукти',
    },
  },
  fields: [
    {
      name: 'id',
      type: 'text',
      required: true,
      admin: {
        hidden: true,
      },
    },
    // Syrve data
    {
      name: 'syrveData',
      type: 'json',
      required: true,
      // hidden: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
        hidden: true,
      },
    },
    // Slug
    slugField('name'),
    // Name Syrve
    {
      name: 'nameSyrve',
      type: 'text',
      label: {
        en: 'Name Syrve',
        pl: 'Nazwa Syrve',
        ru: 'Название Syrve',
        uk: 'Назва Syrve',
      },

      admin: {
        position: 'sidebar',
        readOnly: true,
        description: {
          en: 'Name in Syrve',
          pl: 'Nazwa w Syrve',
          ru: 'Название в Syrve',
          uk: 'Назва в Syrve',
        },
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            // ensures data is not stored in DB
            delete siblingData['nameSyrve'];
          },
        ],
        afterRead: [
          ({ data }) => {
            if (!data?.syrveData) return;
            return data.syrveData.name;
          },
        ],
      },
    },

    // Parent group
    {
      name: 'parentGroup',
      label: {
        en: 'Parent group',
        ru: 'Родительская группа',
        pl: 'Grupa nadrzędna',
        uk: 'Батьківська група',
      },
      type: 'relationship',
      relationTo: 'groups',
      // required: true,
      index: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    // Price
    {
      name: 'price',
      label: {
        en: 'Price',
        ru: 'Цена',
        pl: 'Cena',
        uk: 'Ціна',
      },

      type: 'number',
      admin: {
        hidden: true,
        description: {
          en: 'Price(set by Syrve)',
          pl: 'Cena (ustawiona przez Syrve)',
          ru: 'Цена (установлено Syrve)',
          uk: 'Ціна (встановлено Syrve)',
        },
      },

      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            // ensures data is not stored in DB
            delete siblingData['price'];
          },
        ],
        afterRead: [
          ({ data }) => {
            if (!data?.syrveData) return;
            return data.syrveData.sizePrices[0].price.currentPrice;
          },
        ],
      },
    },
    {
      type: 'tabs',
      tabs: [
        // General
        {
          label: 'General',
          fields: [
            // Name
            {
              name: 'name',
              type: 'text',
              localized: true,
              required: true,
              label: {
                en: 'Name',
                ru: 'Название',
                pl: 'Nazwa',
                uk: 'Назва',
              },
              admin: {
                description: {
                  en: 'Localized name',
                  ru: 'Локализованное название',
                  pl: 'Nazwa z lokalizacją',
                  uk: 'Локалізована назва',
                },
              },
            },
            // Card image
            {
              name: 'cardImage',
              label: {
                en: 'Card image',
                ru: 'Изображение карточки',
                pl: 'Obrazek karty',
                uk: 'Зображення картки',
              },
              type: 'upload',
              relationTo: 'products-cards-images',
              admin: {
                description: {
                  en: 'Used in cards as preview',
                  ru: 'Используется в карточках как превью',
                  pl: 'Używane w kartach jako podgląd',
                  uk: "Використовується в картках як прев'ю",
                },
              },
            },
            // Portion
            {
              type: 'text',
              name: 'quantity',
              label: {
                ru: 'Порция',
                en: 'Portion',
                pl: 'Porcja',
                uk: 'Порція',
              },
              localized: true,
              admin: {
                description: {
                  en: 'Localized text of portion',
                  ru: 'Локализованный текст порции',
                  pl: 'Zlokalizowany tekst porcji',
                  uk: 'Локалізований текст порції',
                },
              },
            },

            // Composition
            {
              type: 'text',
              name: 'composition',
              label: {
                en: 'Composition',
                ru: 'Состав',
                pl: 'Skład',
                uk: 'Склад',
              },
              localized: true,
              admin: {
                description: {
                  en: 'Localized text of composition',
                  ru: 'Локализованный текст состава',
                  pl: 'Zlokalizowany tekst składu',
                  uk: 'Локалізований текст складу',
                },
              },
            },

            // Allergens
            {
              name: 'allergens',
              type: 'relationship',
              relationTo: 'allergens',
              hasMany: true,
              admin: {
                description: {
                  en: 'Choose allergens from list',
                  ru: 'Выберите аллергены из списка',
                  pl: 'Wybierz alergeny z listy',
                  uk: 'Виберіть алергени зі списку',
                },
              },
            },

            // Spicy
            {
              name: 'spicy',
              label: {
                en: 'Spicy',
                ru: 'Острое',
                pl: 'Ostre',
                uk: 'Гостре',
              },
              type: 'checkbox',
              required: true,
            },

            // Vegan
            {
              name: 'vegan',
              label: {
                en: 'Vegan',
                ru: 'Веганское',
                pl: 'Wegańskie',
                uk: 'Веганське',
              },
              type: 'checkbox',
              required: true,
            },

            // Aviability hours
            {
              ...TimeRangePickerField,
              name: 'aviabilityHours',
              label: {
                en: 'Aviability hours',
                ru: 'Часы доступности',
                pl: 'Godziny dostępności',
                uk: 'Години доступності',
              },
            },

            // Aviability days
            {
              type: 'checkbox',
              name: 'availableOnlyForSpecifiedDays',
              label: {
                en: 'Available only for specified days',
                ru: 'Доступно только для указанных дней',
                pl: 'Dostępne tylko w określone dni',
                uk: 'Доступно тільки для вказаних днів',
              },
              admin: {
                description: {
                  en: 'If checked, product will be available only for specified days',
                  ru: 'Если отмечено, продукт будет доступен только для указанных дней',
                  pl: 'Jeśli zaznaczone, produkt będzie dostępny tylko w określone dni',
                  uk: 'Якщо відмічено, продукт буде доступний тільки для вказаних днів',
                },
              },
            },
            {
              name: 'aviabilityDays',
              type: 'text',
              admin: {
                condition: (_, siblingData) =>
                  siblingData.availableOnlyForSpecifiedDays,
                description: {
                  en: 'Format: DD.MM',
                  ru: 'Формат: ДД.ММ',
                  pl: 'Format: DD.MM',
                  uk: 'Формат: ДД.ММ',
                },
              },
              hasMany: true,
              label: {
                en: 'Aviability days',
                ru: 'Дни доступности',
                pl: 'Dni dostępności',
                uk: 'Дні доступності',
              },
            },

            // Hidden
            {
              name: 'hidden',
              label: {
                en: 'Do not show in menu',
                ru: 'Не показывать в меню',
                pl: 'Nie pokazuj w menu',
                uk: 'Не показувати в меню',
              },
              required: true,
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
        // Product page
        {
          label: 'Product page',
          fields: [
            // Hero image
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'products-heroes-images',
              label: {
                en: 'Image for hero section',
                ru: 'Изображение для hero блока',
                pl: 'Obrazek dla sekcji hero',
                uk: 'Зображення для hero блоку',
              },
              admin: {
                description: {
                  en: 'Used as background image of first section',
                  ru: 'Используется как фоновое изображение первого блока',
                  pl: 'Używane jako obraz tła pierwszego bloku',
                  uk: 'Використовується як фонове зображення першого блоку',
                },
              },
            },
            // Description block
            {
              name: 'description',
              type: 'textarea',
              label: {
                en: 'Description',
                ru: 'Описание',
                pl: 'Opis',
                uk: 'Опис',
              },
              admin: {
                description: {
                  ru: 'Блок с текстовым описанием товара',
                  en: 'Block with text description of product',
                  pl: 'Blok z opisem tekstowym produktu',
                  uk: 'Блок з текстовим описом товару',
                },
              },
            },
            // Content
            {
              name: 'content',
              type: 'group',

              fields: [
                {
                  name: 'sliderBlockRecommended',
                  label: {
                    en: 'Recommended',
                    ru: 'Рекомендуем',
                    pl: 'Polecane',
                    uk: 'Рекомендуємо',
                  },

                  type: 'relationship',
                  relationTo: 'products',
                  hasMany: true,
                  admin: {
                    description: {
                      en: 'Products to show in block "You may also like", if empty - block will not be shown',
                      ru: 'Продукты для отображения в блоке "Вам может понравиться", если пусто - блок не будет показан',
                      pl: 'Produkty do wyświetlenia w bloku "Mogą Ci się również spodobać", jeśli jest puste - blok nie zostanie wyświetlony',
                      uk: 'Продукти для відображення в блоку "Вам може сподобатися", якщо порожньо - блок не буде показано',
                    },
                  },
                },
                {
                  type: 'blocks',
                  name: 'blocks',

                  label: {
                    en: 'Custom Blocks',
                    ru: 'Пользовательские блоки',
                    pl: 'Niestandardowe bloki',
                    uk: 'Користувацькі блоки',
                  },
                  blocks: [ProductsSliderBlock],
                },
              ],
              label: {
                en: 'Content',
                ru: 'Контент',
                pl: 'Zawartość',
                uk: 'Контент',
              },
              admin: {
                description: {
                  en: 'Blocks under product description',
                  ru: 'Блоки под описанием продукта',
                  pl: 'Bloki pod opisem produktu',
                  uk: 'Блоки під описом продукту',
                },
              },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeValidate: [autoFillFieldsFromCRM],
  },
  timestamps: false,
  admin: {
    defaultColumns: ['name', 'parentGroup'],
    disableDuplicate: true,
    useAsTitle: 'name',
    // listSearchableFields: ['label'],
    group: {
      en: 'Nomenclature',
      ru: 'Номенклатура',
      pl: 'Nomenklatura',
      uk: 'Номенклатура',
    },
  },
  access: {
    read: () => true,
    update: admins,
    create: () => false,
    delete: admins,
  },
};
export default Products;
