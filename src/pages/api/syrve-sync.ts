import getPayloadClient from '@/payload/payloadClient';
import { PayloadAPI } from '@/services/api/payload-api/payload.api';
import { SyrveAPIProvider } from '@/services/api/syrve.api';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const force = req.query.force === 'true';
  let lastSyncRevision: null | number = null;

  if (!force) {
    try {
      const payload = new PayloadAPI();
      const globalSettings = await payload.getGlobalSettings();
      lastSyncRevision = Number(globalSettings?.lastSyncRevision);
    } catch (error: any) {
      console.warn(error);
      res.status(500).json({ error: error.message });
    }
  }
  const payload = await getPayloadClient();
  // Menu
  const syrveClient = SyrveAPIProvider.getInstance();
  const freshSyrveData = await syrveClient.getMenu({
    // startRevision: lastSyncRevision,
  });

  const { groups, products } = freshSyrveData;

  const freshGroups = groups.filter(
    group => !group.isDeleted && group.isIncludedInMenu
  );
  const groupsSyncResult = await syncCollection({
    freshSyrveData: freshGroups,
    collectionSlug: 'groups',
    payloadClient: payload,
  });

  const freshDishes = products.filter(
    product => product.type === 'Dish' && !product.isDeleted
  );
  const dishesSyncResult = await syncCollection({
    freshSyrveData: freshDishes,
    collectionSlug: 'products',
    payloadClient: payload,
  });
  let lastSyncRevisionResult: any = null;
  try {
    lastSyncRevisionResult = await payload.updateGlobal({
      slug: 'global-settings',
      data: {
        lastSyncRevision: String(freshSyrveData.revision),
      },
    });
  } catch (error: any) {
    lastSyncRevisionResult = error.message;
  }
  res.status(200).json({
    Groups: groupsSyncResult,
    Dishes: dishesSyncResult,
    lastSyncRevision: lastSyncRevisionResult.lastSyncRevision,
  });
}

interface syrveDataObject extends Object {
  id: string;
  isDeleted?: boolean;
}
async function syncCollection({
  freshSyrveData,
  collectionSlug,
  payloadClient,
}: {
  freshSyrveData: syrveDataObject[];
  collectionSlug: string;
  payloadClient: any;
}) {
  const existData = (await payloadClient.find({
    collection: collectionSlug,
    pagination: false,
    showHiddenFields: true,
    limit: 9999999999,
  })) as { docs: { id: string; syrveData: syrveDataObject }[] };

  const currentSyrveData = existData.docs.map(e => e.syrveData);
  const currentItemsIDs = existData.docs.map(e => e.id);
  const newItemsIDs = freshSyrveData.map(e => e.id);
  const elsWithisDeleted = freshSyrveData
    .filter(e => e.isDeleted)
    .map(e => e.id);
  const itemsIDsToDelete = currentItemsIDs.filter(id =>
    elsWithisDeleted.includes(id)
  );
  const itemsToUpdate = currentSyrveData.reduce((acc, item) => {
    const newSyrveData = freshSyrveData.find(e => e.id === item.id);

    if (newSyrveData) {
      if (JSON.stringify(newSyrveData) !== JSON.stringify(item)) {
        return [...acc, newSyrveData];
      }
    }
    return acc;
  }, [] as syrveDataObject[]);
  const itemsToCreate = freshSyrveData.filter(
    item => !currentItemsIDs.includes(item.id)
  );

  // Create
  const createPromises = itemsToCreate.map(
    async item =>
      await payloadClient.create({
        collection: collectionSlug,
        data: {
          id: item.id,
          syrveData: item,
        },
      })
  );

  // Update
  const updatePromises = itemsToUpdate.map(async item => {
    return await payloadClient.update({
      collection: collectionSlug,
      id: item.id,
      data: {
        syrveData: item,
      },
    });
  });

  // Delete
  try {
    const deletePromise = await payloadClient.delete({
      collection: collectionSlug,
      where: {
        id: {
          in: itemsIDsToDelete.join(','),
        },
      },
    });
    const createResult = await Promise.all(createPromises);
    const updateResult = await Promise.all(updatePromises);
    return {
      Tasks: {
        create: createPromises.length,
        update: updatePromises.length,
        delete: itemsIDsToDelete.length,
      },

      Results: {
        create: createResult,
        update: updateResult,
        delete: deletePromise,
      },
    };
  } catch (error: any) {
    return {
      Tasks: {
        create: createPromises.length,
        update: updatePromises.length,
        delete: itemsIDsToDelete.length,
      },
      Results: {
        error: error.message,
      },
    };
  }
}
