/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextRequest } from 'next/server';
import { db } from '~/server/db';

export async function POST(req: NextRequest) {
    const data: any = await req.json();
    const { firstname, surname, email, phone } = data.body;
    try {
        await db.czytelnicy.create({
            data: {
                imie: firstname,
                nazwisko: surname,
                email: email,
                telefon: parseInt(phone),
            },
        });
        return Response.json({ message: 'success' });
    } catch (error) {
        console.log(error);
        return Response.json(error);
    }
}
