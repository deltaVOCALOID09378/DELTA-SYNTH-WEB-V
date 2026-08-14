/**
 * DELTA SYNTH — Wix Data Collection Hooks
 * 
 * Automatically applies timestamps, data normalization, and sanitization
 * across all collections (Voicebanks, Registrations, Contacts, Changelogs)
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

/**
 * Hook before inserting items into any collection
 */
export function beforeInsert(item, context) {
  const now = new Date();
  item._createdDate = item._createdDate || now;
  item._updatedDate = now;
  
  if (item.email && typeof item.email === 'string') {
    item.email = item.email.trim().toLowerCase();
  }
  
  return item;
}

/**
 * Hook before updating items in any collection
 */
export function beforeUpdate(item, context) {
  item._updatedDate = new Date();
  
  if (item.email && typeof item.email === 'string') {
    item.email = item.email.trim().toLowerCase();
  }
  
  return item;
}

/**
 * Voicebanks collection specific hook
 */
export function Voicebanks_beforeInsert(item, context) {
  if (item.name) {
    item.name = item.name.trim();
  }
  if (!item.status) {
    item.status = 'Ready for Download';
  }
  return beforeInsert(item, context);
}

/**
 * Registrations collection specific hook
 */
export function Registrations_beforeInsert(item, context) {
  item.status = item.status || 'Confirmed';
  return beforeInsert(item, context);
}

/**
 * Contacts collection specific hook
 */
export function Contacts_beforeInsert(item, context) {
  item.status = item.status || 'Pending';
  return beforeInsert(item, context);
}
