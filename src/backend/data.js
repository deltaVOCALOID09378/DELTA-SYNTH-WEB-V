/**
 * DELTA SYNTH — Wix Data Collection Hooks
 * 
 * Automatically applies timestamps, data normalization, and sanitization
 * across all collections (Voicebanks, Registrations, Contacts, Changelogs)
 * 
 * Standards from AGENT.md:
 * - Defensive design against null/undefined/non-object items
 * - Safe type checks before string operations
 * - Structured error logging: [Component] Action failed: <cause>. Suggested action: <next step>.
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

/**
 * Hook before inserting items into any collection
 * @param {object} item
 * @param {object} context
 * @returns {object}
 */
export function beforeInsert(item, context) {
  try {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      return item;
    }

    const now = new Date();
    item._createdDate = item._createdDate || now;
    item._updatedDate = now;
    
    if (typeof item.email === 'string') {
      item.email = item.email.trim().toLowerCase();
    }
    
    return item;
  } catch (err) {
    const errorMsg = (err && err.message) ? err.message : String(err);
    console.error(`[DataHooks] beforeInsert failed: ${errorMsg}. Suggested action: Inspect collection payload.`);
    return item;
  }
}

/**
 * Hook before updating items in any collection
 * @param {object} item
 * @param {object} context
 * @returns {object}
 */
export function beforeUpdate(item, context) {
  try {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      return item;
    }

    item._updatedDate = new Date();
    
    if (typeof item.email === 'string') {
      item.email = item.email.trim().toLowerCase();
    }
    
    return item;
  } catch (err) {
    const errorMsg = (err && err.message) ? err.message : String(err);
    console.error(`[DataHooks] beforeUpdate failed: ${errorMsg}. Suggested action: Inspect collection payload.`);
    return item;
  }
}

/**
 * Voicebanks collection specific hook
 * @param {object} item
 * @param {object} context
 * @returns {object}
 */
export function Voicebanks_beforeInsert(item, context) {
  try {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      return item;
    }

    if (typeof item.name === 'string') {
      item.name = item.name.trim();
    }
    if (!item.status || typeof item.status !== 'string') {
      item.status = 'Ready for Download';
    }
    return beforeInsert(item, context);
  } catch (err) {
    const errorMsg = (err && err.message) ? err.message : String(err);
    console.error(`[DataHooks] Voicebanks_beforeInsert failed: ${errorMsg}. Suggested action: Inspect Voicebank item properties.`);
    return beforeInsert(item, context);
  }
}

/**
 * Registrations collection specific hook
 * @param {object} item
 * @param {object} context
 * @returns {object}
 */
export function Registrations_beforeInsert(item, context) {
  try {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      return item;
    }

    if (!item.status || typeof item.status !== 'string') {
      item.status = 'Confirmed';
    }
    if (typeof item.fullName === 'string') {
      item.fullName = item.fullName.trim();
    }
    return beforeInsert(item, context);
  } catch (err) {
    const errorMsg = (err && err.message) ? err.message : String(err);
    console.error(`[DataHooks] Registrations_beforeInsert failed: ${errorMsg}. Suggested action: Inspect Registration item properties.`);
    return beforeInsert(item, context);
  }
}

/**
 * Contacts collection specific hook
 * @param {object} item
 * @param {object} context
 * @returns {object}
 */
export function Contacts_beforeInsert(item, context) {
  try {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      return item;
    }

    if (!item.status || typeof item.status !== 'string') {
      item.status = 'Pending';
    }
    if (typeof item.name === 'string') {
      item.name = item.name.trim();
    }
    if (typeof item.subject === 'string') {
      item.subject = item.subject.trim();
    }
    return beforeInsert(item, context);
  } catch (err) {
    const errorMsg = (err && err.message) ? err.message : String(err);
    console.error(`[DataHooks] Contacts_beforeInsert failed: ${errorMsg}. Suggested action: Inspect Contact item properties.`);
    return beforeInsert(item, context);
  }
}

export default {
  beforeInsert,
  beforeUpdate,
  Voicebanks_beforeInsert,
  Registrations_beforeInsert,
  Contacts_beforeInsert
};
