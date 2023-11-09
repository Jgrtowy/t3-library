/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @next/next/no-async-client-component */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client';
import type { ksiazki } from '@prisma/client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { modal } from '~/utils/swal';

export default function Books() {
    const [data, setData] = useState<ksiazki[]>([]);

    const [search, setSearch] = useState('');
    const [dataChanged, setDataChanged] = useState<boolean>(false);
    useEffect(() => {
        const dataFetch = async () =>
            await axios
                .post(`http://localhost:3000/api/books/search`, {
                    body: {
                        search: search,
                    },
                })
                .then((res) => setData(res.data));
        dataFetch().catch((error) => console.error(error));
    }, [search, dataChanged]);

    const addPopup = async () => {
        const form = await modal.fire({
            title: 'Dodaj książkę',
            html: `
            <form class="flex flex-col gap-3">
                <input class="px-3 py-2 bg-transparent outline-none border-2 border-[#57bd8a]" placeholder="Tytuł" type="text" data-form-type="other" name="title"/>
                <input class="px-3 py-2 bg-transparent outline-none border-2 border-[#57bd8a]" placeholder="Autor" type="text" data-form-type="other" name="author"/>
                <input class="px-3 py-2 bg-transparent outline-none border-2 border-[#57bd8a]" placeholder="Gatunek" type="text" data-form-type="other" name="genre"/>
                <input class="px-3 py-2 bg-transparent outline-none border-2 border-[#57bd8a]" placeholder="Data wydania" type="date" data-form-type="other" name="date"/>
            </form>
            `,
            confirmButtonText: 'Dodaj',
            preConfirm: () => {
                const form = document.querySelector('form') as HTMLFormElement;
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                const values = {
                    title: data.title,
                    author: data.author,
                    genre: data.genre,
                    releaseDate: data.date ?? new Date(),
                };
                return values;
            },
        });

        if (!form.isConfirmed) return;

        const { title, author, genre, releaseDate } = form.value;

        try {
            await axios
                .post(`http://localhost:3000/api/books/add`, {
                    body: {
                        title: title,
                        author: author,
                        genre: genre,
                        releaseDate: releaseDate,
                    },
                })
                .then((res) => console.log(res.data.message === 'success'));
        } catch (error) {
            console.error(error);
        }
    };

    const deleteBook = async (id: number) => {
        await axios.post('http://localhost:3000/api/books/delete', {
            body: {
                id: id,
            },
        });
    };
    return (
        <div className="flex flex-col items-center text-white w-100 h-screen gap-5">
            <div className="flex gap-5 mt-5">
                <input type="text" onInput={(e) => setSearch(e.currentTarget.value)} value={search} className="w-25 text-white px-3 py-1 h-12 bg-transparent outline-none border-2 border-[#57bd8a] rounded-lg text-2xl" />
                <button onClick={addPopup} className="bg-transparent border-2  border-[#57bd8a] outline-none rounded-lg text-2xl px-3 py-1 h-12">
                    Dodaj
                </button>
            </div>

            {data.length !== 0 && (
                <div className="w-screen flex flex-col items-center">
                    <div className="flex justify-around w-screen">
                        <div className="text-3xl w-72">Tytuł</div>
                        <div className="text-3xl w-72">Autor</div>
                        <div className="text-3xl w-72">Gatunek</div>
                        <div className="text-3xl w-72">Data wydania</div>
                    </div>
                    {data.length !== 0 &&
                        data.map((book) => (
                            <div key={book.id_k} className="flex justify-around w-screen">
                                <button onClick={() => deleteBook(book.id_k)}>Usuń</button>
                                <div className="text-lg w-72 ">{book.tytul}</div>
                                <div className="text-lg w-72 ">{book.autor}</div>
                                <div className="text-lg w-72 ">{book.gatunek}</div>
                                <div className="text-lg w-72 ">{book.data_wydania?.toLocaleString()}</div>
                            </div>
                        ))}
                </div>
            )}
            {data.length === 0 && <h1 className="text-6xl">Nie znaleziono książek</h1>}
        </div>
    );
}
