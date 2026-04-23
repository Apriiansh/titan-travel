import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { text } = body;

        if (!text || typeof text !== "string") {
            return NextResponse.json(
                { message: "Text is required and must be a string" },
                { status: 400 }
            );
        }

        // Translate to ID
        const urlId = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=id&dt=t&q=${encodeURIComponent(text)}`;
        const resId = await fetch(urlId);
        const dataId = await resId.json();
        const translatedId = Array.isArray(dataId[0]) ? dataId[0].map((item: unknown) => Array.isArray(item) ? String(item[0]) : "").join('') : text;

        // Translate to MS
        const urlMs = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ms&dt=t&q=${encodeURIComponent(text)}`;
        const resMs = await fetch(urlMs);
        const dataMs = await resMs.json();
        const translatedMs = Array.isArray(dataMs[0]) ? dataMs[0].map((item: unknown) => Array.isArray(item) ? String(item[0]) : "").join('') : text;

        return NextResponse.json({
            en: text,
            id: translatedId,
            ms: translatedMs
        });
    } catch (error) {
        console.error("Translation error:", error);
        return NextResponse.json(
            { message: "Translation failed" },
            { status: 500 }
        );
    }
}
