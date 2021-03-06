import { Request, Response } from 'express';
import knex from '../database/connection';

class PointControllers {
    async show(req: Request, res: Response) {
        const { id } = req.params;
        
        const point = await knex('points').where('id', id).first();

        if(!point) {
            return res.status(400).json({ error: "Point not found" })
        }
        
        const items = await knex('items')
            .join('point_items', 'item_id', '=', 'point_items.item_id')
            .where('point_items.point_id', id);

        return res.json({
            point,
            items
        });
    }

    async store(req: Request, res: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = req.body;
    
        const trx = await knex.transaction();

        const point = {
            image: "fake image",
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
        }
    
        const insertedIds = await trx('points').insert(point);
    
        const point_id = insertedIds[0];
    
        const pointItems = items.map((item_id: number) => {
            return {
                item_id,
                point_id
            };
        })
    
        await trx('point_items').insert(pointItems);
    
        return res.json({
            point_id,
            ...point
        });
    }
}

export default PointControllers