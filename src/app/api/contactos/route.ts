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
    codigo_inmueble: string
    firstname: string
    lastname?: string
    email:string
    phone: string
    mensaje_formulario: string
}

interface AsesorData {
    rol_tr: string;
    iduser_tr: string;
    nrol: string;
    ntercero: string;
    celular: string;
    fijo: string;
    correo: string;
    Direccion: string;
    cedtercero: string;
    tDoctercero: string;
    vip: string;
    FotoAsesor: string;
    NomtDoctercero: string;
}

interface CaptadorData {
    rol_tr: string; // Código del rol
    iduser_tr: string; // ID del usuario
    nrol: string; // Nombre del rol, ej: "Captador"
    ntercero: string; // Nombre completo del tercero
    celular: string;
    fijo: string;
    correo: string;
    Direccion: string;
    cedtercero: string; // Cédula o NIT
    tDoctercero: string; // Tipo de documento como código
    vip: 'Sí' | 'No';
    FotoAsesor: string; // URL de la foto
    NomtDoctercero: string; // Nombre del tipo de documento
  }

interface Inmueble {
    idInm: string;
    codinm: string;
    IdInmobiliaria: string;
    NombresGestion: string;
    tpinmu: string;
    NombreB: string;
    fecha_modificacion: string;
    alcobas: string;
    banos: string;
    garaje: string;
    ValorVenta: string;
    ValorCanon: string;
    Direccion: string;
    AreaConstruida: string;
    AreaLote: string;
    descripcionlarga :string;
    latitud: string;
    longitud: string;
    nlocalidad: string;
    NombreZ: string;
    nciudad: string;
    Estrato: string;
    ValorIva: string;
    Administracion: string;
    DescDestinacion: string;
    DescEstado: string;
    EdadInmueble: string;
    sede: string;
    ndepto: string;
    FConsignacion: string;
    restricciones: string;
    AdmonIncluida: string;
    oper: string;
    precio: string;
    esNuevo: string;
    depto: string;
    Tipo_Inmueble: string;
    ciudad: string;
    Gestion: string;
    zona: string;
    localidad: string;
    nombreDestinacion: string;
    asesor: AsesorData[];
    captador: CaptadorData[];
    amobladoInmueble: boolean;
    barrio: string;
}

const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;
const HUBSPOT_API = "https://api.hubapi.com";
const SIMI_TOKEN = process.env.SIMI_TOKEN;

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
    const urlSimi = 'http://simi-api.com/ApiSimiweb/response/v2/inmueble/codInmueble/';
    try {
        const body:IdatosFormulario  = await req.json();

        if (!HUBSPOT_API_KEY) {
            return NextResponse.json(
                { success: false, message: "HubSpot token is missing" },
                { status: 500 }
            );
        }

        const {
            codigo_inmueble,
            firstname,
            lastname,
            mensaje_formulario,
            phone,
            email,
        } = body;

        const responseSimi: any = await fetch(urlSimi + codigo_inmueble, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${SIMI_TOKEN}`,
                'Content-Type': 'application/json'
            },
        });

        const product: Inmueble = await responseSimi.json();

        const dataInmuebleCreate: any= { properties: {
            name: `${product.Tipo_Inmueble}-${product.idInm}`,
            hs_sku: product.idInm,
            codigo_inmueble: product.idInm,
            fingreso: product.FConsignacion, // Descripción del producto
            alcobas: product.alcobas, // Precio del producto
            banios: product.banos, // Tipo de producto (opcional)
            garaje: product.garaje, // Código SKU del producto
            estadoinmueble: product.DescEstado, // Precio en HubSpot
            administracion: product.Administracion,
            estrato: product.Estrato,
            tipo_inmueble: product.Tipo_Inmueble,
            gestion: product.Gestion,
            price: parseFloat(product.ValorVenta.replace(/,/g, '')),
            venta: product.ValorVenta,
            canon: product.ValorCanon,
            descripcionlarga: product.descripcionlarga,
            areaconstruida: product.AreaConstruida,
            arealote: product.AreaLote,
            latitud: product.latitud,
            longitud: product.longitud,
            barrio: product.barrio,
            ciudad: product.ciudad,
            departamento: product.ndepto,
            zona: product.zona,
            sede: product.sede,
            amobladoinmueble: product.amobladoInmueble,
            admonincluida: product.AdmonIncluida
        }}

        const dataInmuebleUpdate: any= { properties: {
            name: `${product.Tipo_Inmueble}-${product.idInm}`,
            codigo_inmueble: product.idInm,
            fingreso: product.FConsignacion, // Descripción del producto
            alcobas: product.alcobas, // Precio del producto
            banios: product.banos, // Tipo de producto (opcional)
            garaje: product.garaje, // Código SKU del producto
            estadoinmueble: product.DescEstado, // Precio en HubSpot
            administracion: product.Administracion,
            estrato: product.Estrato,
            tipo_inmueble: product.Tipo_Inmueble,
            gestion: product.Gestion,
            price: parseFloat(product.ValorVenta.replace(/,/g, '')),
            venta: product.ValorVenta,
            canon: product.ValorCanon,
            descripcionlarga: product.descripcionlarga,
            areaconstruida: product.AreaConstruida,
            arealote: product.AreaLote,
            latitud: product.latitud,
            longitud: product.longitud,
            barrio: product.barrio,
            ciudad: product.ciudad,
            departamento: product.ndepto,
            zona: product.zona,
            sede: product.sede,
            amobladoinmueble: product.amobladoInmueble,
            admonincluida: product.AdmonIncluida
        }}

        const productSearch = await fetchHubSpot('/crm/v3/objects/products/search', 'POST', {
            filterGroups: [{
              filters: [{
                propertyName: 'hs_sku',
                operator: 'EQ',
                value: codigo_inmueble,
              }]
            }],
            properties: ['hs_object_id', 'name', 'hs_sku'],
        });

        let productId: string;

        if (productSearch.total > 0) {
            // 2. Update product if exists
            productId = productSearch.results[0].id;
            await fetchHubSpot(`/crm/v3/objects/products/${productId}`, 'PATCH', dataInmuebleUpdate);
          } else {
            // 3. Create product
            const newProduct = await fetchHubSpot('/crm/v3/objects/products', 'POST', dataInmuebleCreate);
            productId = newProduct.id;
        }

        // 4. Find or create contact
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
        } else {
            const newContact = await fetchHubSpot('/crm/v3/objects/contacts', 'POST', {
                properties: {
                    firstname: firstname,
                    email: email,
                    phone: phone,
                    mensaje_formulario: mensaje_formulario,
                }
        });
            contactId = newContact.id;
        }

        const precio = product.ValorVenta == '0' ? parseFloat(product.ValorCanon.replace(/,/g, '')) : parseFloat(product.ValorVenta.replace(/,/g, ''));

         // 5. Create deal
        const newDeal = await fetchHubSpot('/crm/v3/objects/deals', 'POST', {
            properties: {
                dealname: `Interés en ${product.Tipo_Inmueble}-${product.idInm}`,
                pipeline: 'default',
                dealstage: 'appointmentscheduled',
                amount: precio,
            }
        });

        const dealId = newDeal.id;
        
        // Create the line item
        const lineItemRes = await fetch(`https://api.hubapi.com/crm/v3/objects/line_items`, {
            method: 'POST',
            headers: {
            'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            properties: {
                name: `${product.Tipo_Inmueble}-${product.idInm}`,
                quantity: 1,
                price: precio, // example price
            }
            })
        });
  
        const lineItemData = await lineItemRes.json();
        const lineItemId = lineItemData.id;
        console.log('lineItem', lineItemId);
  
        // 1. Associate Line Item with Product
        await fetch(`https://api.hubapi.com/crm/v4/objects/line_items/${lineItemId}/associations/products/${productId}`, {
            method: 'PUT',
            headers: {
            'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                types: [
                    {
                    associationCategory: "HUBSPOT_DEFINED",
                    associationTypeId: 20 // this is the correct association between line item and product
                    }
                ]
            }),
        });
    
        // 2. Associate Line Item with Deal
        await fetch(`https://api.hubapi.com/crm/v4/objects/line_items/${lineItemId}/associations/deals/${dealId}`, {
            method: 'PUT',
            headers: {
            'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                types: [
                    {
                    associationCategory: "HUBSPOT_DEFINED",
                    associationTypeId: 19 // association from line item to deal
                    }
                ]
            }),
        });
  
        // 7. Associate deal with contact
        await fetchHubSpot(`/crm/v3/objects/deals/${dealId}/associations/contacts/${contactId}/3`, 'PUT');

        // Formatear los datos para HubSpot
        // const hubspotData = {
        //     properties: {
        //         firstname: body.firstname,
        //         email: body.email,
        //         phone: body.phone,
        //         mensaje_formulario: body.mensaje_formulario,
        //     },
        // };

        // Enviar datos a HubSpot
        // const response = await fetch(HUBSPOT_ENDPOINT, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //         Authorization: `Bearer ${HUBSPOT_API_KEY}`, // Autenticación Bearer
        //     },
        //     body: JSON.stringify(hubspotData),
        // });

        // if (!response.ok) {
        //     const errorData = await response.json();
        //     throw new Error(errorData.message || "Error al enviar datos a HubSpot");
        // }

        return NextResponse.json(
            { success: true, message: "Contact sent to HubSpot successfully", product: dealId },
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
  
  