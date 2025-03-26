import { NextResponse } from "next/server";

export async function OPTIONS() {
    return NextResponse.json({}, { 
        status: 200,
        headers: new Headers({
        "Access-Control-Allow-Origin": "*",  // Allow all origins
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        }),
    });
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Token de autenticación (debería estar en variables de entorno)
        const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;
        const HUBSPOT_ENDPOINT = "https://api.hubapi.com/crm/v3/objects/contacts";

        if (!HUBSPOT_API_KEY) {
            return NextResponse.json(
                { success: false, message: "HubSpot token is missing" },
                { status: 500 }
            );
        }

        // Formatear los datos para HubSpot
        const hubspotData = {
            properties: {
                firstname: body.firstname,
                email: body.email,
                phone: body.phone,
                mensaje_formulario: body.mensaje_formulario,
            },
        };

        // Enviar datos a HubSpot
        const response = await fetch(HUBSPOT_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${HUBSPOT_API_KEY}`, // Autenticación Bearer
            },
            body: JSON.stringify(hubspotData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al enviar datos a HubSpot");
        }

        return NextResponse.json(
            { success: true, message: "Contact sent to HubSpot successfully" },
            {
              headers: new Headers({
                "Access-Control-Allow-Origin": "*", // Allow all origins
              }),
            }
        );
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
  
  