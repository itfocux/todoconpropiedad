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

interface IdatosFormulario {
    firstname: string
    lastname?: string
    email:string
    phone: string
    city: string
    consigna_inmueble_tipo_de_gestion: string
    tipo_de_inmueble_formulario_web: string
    tratamiento_datos: boolean
}

const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;
const HUBSPOT_API = "https://api.hubapi.com";

const fetchHubSpot = async (url: string, method = 'GET', body?: any) => {
    const options: RequestInit = {
        method,
        headers: {
        Authorization: `Bearer ${HUBSPOT_API_KEY}`,
        'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
    };

    const response = await fetch(`${HUBSPOT_API}${url}`, options);
    if (!response.ok) {
        const error = await response.json();
        throw new Error(JSON.stringify(error));
    }

    return response.json();
};
export async function POST(req: Request) {
    try {

        if (!HUBSPOT_API_KEY) {
            return NextResponse.json(
                { success: false, message: "HubSpot token is missing" },
                { status: 500 }
            );
        }

        const body:IdatosFormulario  = await req.json();

        const {
            email,
            tratamiento_datos,
            ...formData
        } = body;

        console.log('formData', formData)

        let contactId: string;

        const contactSearch = await fetchHubSpot('/crm/v3/objects/contacts/search', 'POST', {
            filterGroups: [{
                filters: [{
                propertyName: 'email',
                operator: 'EQ',
                value: email,
                }]
            }]
        });

        if (contactSearch.total > 0) {
            contactId = contactSearch.results[0].id;
            await fetchHubSpot(`/crm/v3/objects/contacts/${contactId}`, 'PATCH', {
                properties: { ...formData, aceptacion_de_la_politica_de_privacidad_y_tratamiento_de_datos: tratamiento_datos, email, consignatario: 'SI', hubspot_owner_id: 79691639, hs_lead_status: 'Lead Nuevo' }
            });
        } else {
            const newContact = await fetchHubSpot('/crm/v3/objects/contacts', 'POST', {
                properties: { ...formData, aceptacion_de_la_politica_de_privacidad_y_tratamiento_de_datos: tratamiento_datos, email, consignatario: 'SI', hubspot_owner_id: 79691639, hs_lead_status: 'Lead Nuevo' }
            });
            contactId = newContact.id;
        }

        return NextResponse.json(
            { success: true, message: "Contact sent to HubSpot successfully", contact: contactId ? true : false },
            {
              headers: new Headers({
                "Access-Control-Allow-Origin": "*", // Allow all origins
              }),
            }
        );
    } catch (error:any) {
        console.log('Hubo un error en la integracion del formulario con hubspot', error.message)
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
