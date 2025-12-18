import Event from '../models/Event.js';

export const createEvent = async (req, res) => {
  try {
    // Support both single event object and batch: top-level array or { events: [...] }
    const incomingEvents = Array.isArray(req.body) ? req.body : req.body.events;
    if (Array.isArray(incomingEvents)) {
      const events = incomingEvents;
      if (events.length === 0) return res.status(400).json({ error: 'Events must be a non-empty array' });

      const docs = events.map((e) => ({
        userName: e.userName,
        page: e.page,
        event: e.event,
        time: e.time ? new Date(e.time) : new Date(),
        metadata: e.metadata
      }));

      const inserted = await Event.insertMany(docs, { ordered: false });
      const count = inserted.length;
      const failedCount = (docs.length || 0) - count;
      const successMsg = `${count} ${count === 1 ? 'record' : 'records'} added`;
      const failedMsg = `${failedCount} ${failedCount === 1 ? 'record' : 'records'} failed to add`;
      return res.status(201).json({ success: successMsg, failed: failedMsg });
    }

    const { userName, page, event, time, metadata } = req.body;
    if (!userName || !page || !event) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await Event.create({ userName, page, event, time: time ? new Date(time) : new Date(), metadata });
    return res.status(201).json({ success: '1 record added', failed: '0 records failed to add' });
  } catch (err) {
    // handle partial insertion from insertMany
    if (err && err.insertedDocs) {
      const count = err.insertedDocs.length;
      const requested = Array.isArray(req.body.events) ? req.body.events.length : Array.isArray(req.body) ? req.body.length : 0;
      const failedCount = requested - count;
      const successMsg = `${count} ${count === 1 ? 'record' : 'records'} added`;
      const failedMsg = `${failedCount} ${failedCount === 1 ? 'record' : 'records'} failed to add`;
      return res.status(207).json({ success: successMsg, failed: failedMsg });
    }
    return res.status(500).json({ success: '0 records added', failed: `1 record failed to add: ${err.message}` });
  }
};

export const listEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json({ count: events.length, events });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

