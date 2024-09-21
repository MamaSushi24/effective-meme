import { Field, GlobalConfig } from 'payload/types';

import timeRangeField from '../../fields/time-range-picker';
import { JSONField } from 'payload/dist/fields/config/types';
import { admins } from '../../access/admins';
import SideBarRowLabel from './components/side-bar-row-label/side-bar-row-label';
import { slateEditor } from '@payloadcms/richtext-slate';
import { useState } from 'react';
import React from 'react';
import { PatternField } from '@nouance/payload-better-fields-plugin';
const createWorkingHoursFields = (): Field[] => {
  const daysEN = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];
  const daysPL = [
    'poniedziałek',
    'wtorek',
    'środa',
    'czwartek',
    'piątek',
    'sobota',
    'niedziela',
  ];
  const daysUK = [
    'понеділок',
    'вівторок',
    'середа',
    'четвер',
    "п'ятниця",
    'субота',
    'неділя',
  ];
  const daysRU = [
    'понедельник',
    'вторник',
    'среда',
    'четверг',
    'пятница',
    'суббота',
    'воскресенье',
  ];
  const fields: JSONField[] = [];

  for (let i = 0; i < 7; i++) {
    fields.push({
      ...timeRangeField,
      name: daysEN[i],
      // required: true,

      label: {
        en: daysEN[i],
        ru: daysRU[i],
        pl: daysPL[i],
        uk: daysUK[i],
      },
    });
  }
  return fields;
};
const GlobalSettings: GlobalConfig = {
  slug: 'global-settings',
  label: {
    en: 'Global settings',
    ru: 'Глобальные настройки',
    pl: 'Ustawienia globalne',
    uk: 'Глобальні налаштування',
  },

  fields: [
    {
      type: 'tabs',
      tabs: [
        // General
        {
          label: {
            en: 'General',
            ru: 'Общее',
            pl: 'Ogólne',
            uk: 'Загальне',
          },
          fields: [
            // Site name
            {
              name: 'siteName',
              type: 'text',
              label: {
                en: 'Site name',
                ru: 'Название сайта',
                pl: 'Nazwa strony',
                uk: 'Назва сайту',
              },
              required: true,
              localized: true,
              admin: {
                description: {
                  en: 'Localize to change site name for different languages',
                  ru: 'Локализуйте, чтобы изменить название сайта для разных языков',
                  pl: 'Zlokalizuj, aby zmienić nazwę witryny dla różnych języków',
                  uk: 'Локалізуйте, щоб змінити назву сайту для різних мов',
                },
              },
            },

            // Drinks category
            {
              name: 'drinksCategory',
              type: 'relationship',
              relationTo: 'groups',
              label: {
                en: 'Drinks category',
                ru: 'Категория напитков',
                pl: 'Kategoria napojów',
                uk: 'Категорія напоїв',
              },
              required: true,
            },
          ],
        },
        // Working hours
        {
          label: {
            en: 'Working hours',
            ru: 'Рабочие часы',
            pl: 'Godziny pracy',
            uk: 'Робочі години',
          },
          fields: [
            // Temporary closed
            {
              name: 'temporaryClosed',
              type: 'checkbox',
              label: {
                en: 'Temporary closed',
                ru: 'Временно закрыто',
                pl: 'Tymczasowo zamknięte',
                uk: 'Тимчасово закрито',
              },
            },
            //  Temporary closed message
            {
              name: 'temporaryClosedMessage',
              type: 'textarea',
              label: {
                en: 'Temporary closed message',
                ru: 'Сообщение о временном закрытии',
                pl: 'Wiadomość o czasowym zamknięciu',
                uk: 'Повідомлення про тимчасове закриття',
              },
              localized: true,
              admin: {
                description: {
                  en: 'Message to show when the restaurant is temporary closed',
                  ru: 'Сообщение, которое будет показано, когда ресторан временно закрыт',
                  pl: 'Wiadomość, która zostanie wyświetlona, gdy restauracja będzie tymczasowo zamknięta',
                  uk: 'Повідомлення, яке буде показано, коли ресторан тимчасово закритий',
                },
                condition: (_, siblingData) => siblingData.temporaryClosed,
              },
            },
            // Working hours
            {
              name: 'workingHours',
              label: {
                en: 'Working hours',
                ru: 'Рабочие часы',
                pl: 'Godziny pracy',
                uk: 'Робочі години',
              },
              type: 'group',
              fields: [...createWorkingHoursFields()],
              admin: {
                description: {
                  ru: 'Рабочие часы для каждого дня недели(оставьте пустым для нерабочего дня)',
                  en: 'Working hours for each day of the week (leave blank for non-working day)',
                  pl: 'Godziny pracy dla każdego dnia tygodnia (pozostaw puste dla dnia wolnego od pracy)',
                  uk: 'Робочі години для кожного дня тижня (залиште порожнім для неробочого дня)',
                },
              },
            },
          ],
        },
        // Delivery
        {
          label: {
            en: 'Delivery',
            ru: 'Доставка',
            pl: 'Dostawa',
            uk: 'Доставка',
          },
          fields: [
            {
              name: 'delivery',
              // label: '',
              type: 'group',
              fields: [
                {
                  name: 'minOrderPrice',
                  type: 'number',
                  label: {
                    en: 'Min order price',
                    ru: 'Минимальная сумма заказа',
                    pl: 'Minimalna kwota zamówienia',
                    uk: 'Мінімальна сума замовлення',
                  },
                  required: true,
                  defaultValue: 70,
                },
                {
                  name: 'freeDeliveryPrice',
                  type: 'number',
                  label: {
                    en: 'Free delivery price >=',
                    ru: 'Сумма бесплатной доставки >=',
                    pl: 'Cena darmowej dostawy >=',
                    uk: 'Сума безкоштовної доставки >=',
                  },
                  required: true,
                  defaultValue: 300,
                },
                {
                  name: 'selfDeliveryDiscount',
                  type: 'number',
                  label: {
                    en: 'Self delivery discount',
                    ru: 'Скидка самовывоза',
                    pl: 'Rabat na odbiór osobisty',
                    uk: 'Знижка самовивозу',
                  },
                  required: true,
                  defaultValue: 10,
                },

                // Custom delivery Days
                {
                  name: 'customDeliveryDays',
                  type: 'text',
                  required: false,
                  validate: (value, options) => {
                    // If value is not empty test all nested values and return false if any of them is not a valid date in format DD.MM
                    if (value && value?.lenght > 0) {
                      const isAllValid = value.every(date => {
                        if (typeof date !== 'string') return false;
                        return /^\d{2}\.\d{2}$/.test(date);
                      });
                      if (!isAllValid)
                        return 'All dates should be in format DD.MM';
                      return true;
                    }
                    return true;
                  },
                  hasMany: true,
                },
              ],
              admin: {
                hideGutter: true,
              },
            },
          ],
        },
        // Contacts
        {
          label: {
            en: 'Contacts',
            ru: 'Контакты',
            pl: 'Kontakty',
            uk: 'Контакти',
          },
          fields: [
            // Phone
            {
              name: 'phone',
              type: 'array',
              label: {
                en: 'Phone',
                ru: 'Телефон',
                pl: 'Telefon',
                uk: 'Телефон',
              },
              fields: [
                {
                  type: 'text',
                  name: 'number',
                  label: {
                    en: 'Number',
                    ru: 'Номер',
                    pl: 'Numer',
                    uk: 'Номер',
                  },
                  required: true,
                },
              ],
            },
            // Social
            {
              name: 'facebookLink',
              type: 'text',
              label: 'Facebook',
            },
            {
              name: 'instagramLink',
              type: 'text',
              label: 'Instagram',
            },
            // Address
            {
              type: 'textarea',
              name: 'address',
              label: {
                en: 'Address',
                ru: 'Адрес',
                pl: 'Adres',
                uk: 'Адреса',
              },
              localized: true,
            },
          ],
        },
        // Modal promotion
        {
          label: {
            en: 'Modal promotion',
            ru: 'Модальное окно с акцией',
            pl: 'Promocja modalna',
            uk: 'Модальне вікно з акцією',
          },
          fields: [
            {
              name: 'modalPromotion',
              label: {
                en: 'Modal promotion',
                ru: 'Модальное окно с акцией',
                pl: 'Promocja modalna',
                uk: 'Модальне вікно з акцією',
              },
              type: 'group',
              fields: [
                //   TITLE
                {
                  name: 'title',
                  label: {
                    en: 'Title',
                    pl: 'Tytuł',
                    ru: 'Заголовок',
                    uk: 'Заголовок',
                  },
                  type: 'richText',
                  localized: true,
                  required: true,
                  editor: slateEditor({
                    admin: {
                      elements: [],
                      leaves: ['bold', 'italic', 'underline'],
                    },
                  }),
                },
                //  DESCRIPTION
                {
                  name: 'description',
                  label: {
                    en: 'Description',
                    pl: 'Opis',
                    ru: 'Описание',
                    uk: 'Опис',
                  },
                  type: 'richText',
                  localized: true,
                  required: true,
                  editor: slateEditor({
                    admin: {
                      elements: [],
                      leaves: ['bold', 'italic', 'underline'],
                    },
                  }),
                },
                // CTA
                {
                  name: 'cta',
                  type: 'group',
                  label: {
                    en: 'CTA',
                    pl: 'CTA',
                    ru: 'CTA',
                    uk: 'CTA',
                  },
                  fields: [
                    {
                      name: 'text',
                      label: {
                        en: 'Text',
                        pl: 'Tekst',
                        ru: 'Текст',
                        uk: 'Текст',
                      },
                      type: 'text',
                      localized: true,
                      required: true,
                    },
                    {
                      name: 'link',
                      label: {
                        en: 'Link',
                        pl: 'Link',
                        ru: 'Ссылка',
                        uk: 'Посилання',
                      },
                      type: 'text',
                      required: true,
                    },
                  ],
                },
                // Decline
                {
                  name: 'declineText',
                  label: {
                    en: 'Decline text',
                    pl: 'Tekst odmowy',
                    ru: 'Текст отказа',
                    uk: 'Текст відмови',
                  },
                  type: 'text',
                  localized: true,
                },
                // Background image
                {
                  name: 'backgroundImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: {
                    en: 'Background image',
                    pl: 'Zdjęcie tła',
                    ru: 'Фоновое изображение',
                    uk: 'Фонове зображення',
                  },
                  admin: {
                    description: {
                      en: 'Recommended width: 775px, aspect ratio: 1:1.5',
                      pl: 'Zalecana szerokość: 775px, proporcje: 1:1.5',
                      ru: 'Рекомендуемая ширина: 775px, соотношение сторон: 1:1.5',
                      uk: 'Рекомендована ширина: 775px, співвідношення сторін: 1:1.5',
                    },
                  },
                  required: true,
                },
                // Is active
                {
                  name: 'isActive',
                  type: 'checkbox',
                  defaultValue: false,
                  label: {
                    en: 'Is active',
                    pl: 'Aktywny',
                    ru: 'Активный',
                    uk: 'Активний',
                  },
                },
              ],
            },
          ],
        },
        // Syrve
        {
          label: 'Syrve sync',
          fields: [
            {
              name: 'lastSyncRevision',
              type: 'text',
              admin: {
                readOnly: true,
              },
            },
            // Sync button\
            {
              name: 'sync',
              type: 'ui',
              admin: {
                components: {
                  Field: () => {
                    const [isSyncing, setIsSyncing] = useState(false);
                    const [error, setError] = useState(null);
                    const [success, setSuccess] = useState<boolean>(false);
                    const onClick = async () => {
                      setIsSyncing(true);
                      setSuccess(false);
                      try {
                        const response = await fetch('/api/syrve-sync', {
                          method: 'GET',
                        }).then(res => res.json());
                        console.log(response);
                        setSuccess(true);
                      } catch (error) {
                        setError(error);
                      } finally {
                        setIsSyncing(false);
                      }
                    };
                    return (
                      <>
                        {' '}
                        <button
                          onClick={onClick}
                          type="button"
                          disabled={isSyncing}
                          style={{
                            padding: '10px 20px',
                            cursor: 'pointer',
                          }}
                        >
                          Sync
                        </button>
                        {success && (
                          <p
                            style={{
                              margin: '10px 0',
                            }}
                          >
                            OK!
                          </p>
                        )}
                      </>
                    );
                  },
                },
              },
            },
          ],
        },

        // Sidebar
        {
          label: {
            en: 'Sidebar',
            ru: 'Сайдбар',
            pl: 'Sidebar',
            uk: 'Сайдбар',
          },

          fields: [
            {
              name: 'sidebar',
              type: 'group',

              fields: [
                {
                  name: 'items',
                  type: 'array',
                  required: true,
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'group',
                          type: 'relationship',
                          relationTo: 'collections',
                          required: true,
                          maxDepth: 1,
                        },
                        {
                          name: 'icon',
                          type: 'upload',
                          relationTo: 'icons',
                          required: true,
                        },
                      ],
                    },
                  ],
                  admin: {
                    initCollapsed: true,
                    components: {
                      RowLabel: SideBarRowLabel,
                    },
                  },
                },
              ],
              admin: {
                hideGutter: true,
                disableBulkEdit: true,
              },
            },
          ],
        },

        // SEO
        {
          label: 'SEO',
          fields: [
            {
              name: 'seo',
              type: 'group',
              fields: [
                {
                  name: 'jsonld',
                  type: 'json',
                  label: 'JSON-LD',
                  localized: true,
                  required: false,
                  admin: {
                    description: {
                      en: 'Common JSON-LD for all pages',
                      ru: 'Общий JSON-LD для всех страниц',
                      pl: 'Wspólny JSON-LD dla wszystkich stron',
                      uk: 'Загальний JSON-LD для всіх сторінок',
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  access: {
    read: () => true,
    update: admins,
  },
};

export default GlobalSettings;
