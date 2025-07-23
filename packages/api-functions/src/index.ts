import { onRequest } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';
import * as admin from 'firebase-admin';
import type { Component, ComponentCategoryType } from '@kinben/shared-types';

// Initialize Firebase Admin SDK
admin.initializeApp();

/**
 * Health check endpoint
 */
export const healthCheck = onRequest((request, response) => {
  logger.info('Health check requested', { structuredData: true });
  response.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

/**
 * Get components by category
 */
export const getComponents = onRequest(async (request, response) => {
  try {
    const { category } = request.query;
    
    if (!category || typeof category !== 'string') {
      response.status(400).json({ error: 'Category parameter is required' });
      return;
    }

    const db = admin.firestore();
    const componentsRef = db.collection('components').where('category', '==', category);
    const snapshot = await componentsRef.get();
    
    const components: Component[] = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      components.push({ 
        ...data,
        id: parseInt(doc.id) || Date.now() // Convert Firestore doc id to number
      } as Component);
    });

    response.status(200).json({
      category,
      components,
      count: components.length
    });
  } catch (error) {
    logger.error('Error getting components:', error);
    response.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Add new component
 */
export const addComponent = onRequest(async (request, response) => {
  try {
    if (request.method !== 'POST') {
      response.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const componentData = request.body as Partial<Component>;
    
    if (!componentData.category || !componentData.name || !componentData.kpn) {
      response.status(400).json({ error: 'Missing required fields: category, name, kpn' });
      return;
    }

    const db = admin.firestore();
    const docRef = await db.collection('components').add({
      ...componentData,
      dateAdded: new Date().toISOString(),
      status: componentData.status || 'Active'
    });

    response.status(201).json({
      id: docRef.id,
      message: 'Component added successfully'
    });
  } catch (error) {
    logger.error('Error adding component:', error);
    response.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Update component
 */
export const updateComponent = onRequest(async (request, response) => {
  try {
    if (request.method !== 'PUT') {
      response.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const { id } = request.query;
    const updates = request.body;

    if (!id || typeof id !== 'string') {
      response.status(400).json({ error: 'Component ID is required' });
      return;
    }

    const db = admin.firestore();
    await db.collection('components').doc(id).update(updates);

    response.status(200).json({
      id,
      message: 'Component updated successfully'
    });
  } catch (error) {
    logger.error('Error updating component:', error);
    response.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Delete component
 */
export const deleteComponent = onRequest(async (request, response) => {
  try {
    if (request.method !== 'DELETE') {
      response.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const { id } = request.query;

    if (!id || typeof id !== 'string') {
      response.status(400).json({ error: 'Component ID is required' });
      return;
    }

    const db = admin.firestore();
    await db.collection('components').doc(id).delete();

    response.status(200).json({
      id,
      message: 'Component deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting component:', error);
    response.status(500).json({ error: 'Internal server error' });
  }
});