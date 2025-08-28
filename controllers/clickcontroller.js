import Click from "../models/click.js";

export const clickHandler = async (req, res) => {
    try {
        const click = await Click.findOneAndUpdate(
          {}, // No filter since only one document
          { $inc: { clickCount: 1 } },
          { new: true, upsert: true } // Create if it doesn't exist
        );
    
        res.json({ message: 'Click counted', count: click.clickCount });
      } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
      }
    };

export const getClickCount = async (req, res) => {
    try {
        const click = await Click.findOne();
        res.json({ count: click.clickCount });
      } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
      }
    };
    