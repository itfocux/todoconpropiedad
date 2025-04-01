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

interface IsimiInmueble {
    Codigo_Inmueble: string;
    IdInmobiliaria: string;
    fingreso: string;
    Alcobas: string;
    banios: string;
    garaje: string;
    idEstado: string;
    estadoInmueble: string;
    Administracion: string;
    Estrato: string;
    idTipoInmueble: string;
    Tipo_Inmueble: string;
    idGestion: string;
    Gestion: string;
    Venta: string;
    Canon: string;
    valorFiltro: string;
    descripcionlarga: string;
    AreaConstruida: string;
    AreaLote: string;
    latitud: string;
    longitud: string;
    EdadInmueble: null;
    NombreInmo: string;
    foto1: string;
    logo: string;
    Barrio: string;
    Ciudad: string;
    Departamento: string;
    Zona: string;
    foto360: number;
    sede: string;
    id_sede: string;
    video360: null;
}

interface IsimiResponse {
    "0" : IsimiInmueble
}

export async function GET() {
    try {
        const hubspotToken = process.env.HUBSPOT_API_KEY; // Asegúrate de definir este token en tus variables de entorno
        const simiToken = process.env.SIMI_TOKEN;

        const urlHubspot = 'https://api.hubapi.com/crm/v3/objects/products';
        const urlSimi = 'http://www.simi-api.com/ApiSimiweb/response/v21/inmueblesDestacados/total/10/limite/1';

        const responseSimi: any = await fetch(urlSimi, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${simiToken}`,
                'Content-Type': 'application/json'
            },
        });

        const dataSimi = await responseSimi.json();

        if (!dataSimi["0"]) {
            return Response.json({ error: "No se encontró el primer inmueble" }, { status: 404 });
        }

        const firstProperty: IsimiInmueble = dataSimi["0"];
        
        // Configurar las propiedades del producto en HubSpot
        const productData = {
            properties: {
                name: `${firstProperty.Tipo_Inmueble}-${firstProperty.Codigo_Inmueble}`,
                hs_sku: firstProperty.Codigo_Inmueble,
                codigo_inmueble: firstProperty.Codigo_Inmueble,
                fingreso: firstProperty.fingreso, // Descripción del producto
                alcobas: firstProperty.Alcobas, // Precio del producto
                banios: firstProperty.banios, // Tipo de producto (opcional)
                garaje: firstProperty.garaje, // Código SKU del producto
                estadoinmueble: firstProperty.estadoInmueble, // Precio en HubSpot
                administracion: firstProperty.Administracion,
                estrato: firstProperty.Estrato,
                tipo_inmueble: firstProperty.Tipo_Inmueble,
                gestion: firstProperty.Gestion,
                venta: firstProperty.Venta,
                canon: firstProperty.Canon,
                valorfiltro: firstProperty.valorFiltro,
                descripcionlarga: firstProperty.descripcionlarga,
                areaconstruida: firstProperty.AreaConstruida,
                arealote: firstProperty.AreaLote,
                latitud: firstProperty.latitud,
                longitud: firstProperty.longitud,
                foto1: firstProperty.foto1,
                logo: firstProperty.logo,
                barrio: firstProperty.Barrio,
                ciudad: firstProperty.Ciudad,
                departamento: firstProperty.Departamento,
                zona: firstProperty.Zona,
                foto360: firstProperty.foto360,
                sede: firstProperty.sede
            }
        };

        // Realizar la solicitud a HubSpot
        const response = await fetch(urlHubspot, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${hubspotToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });

        const data = await response.json();

        return Response.json(data, { status: response.status });
    } catch (error) {
        console.error("Error creando el producto en HubSpot:", error);
        return Response.json({ error: "Error creando el producto" }, { status: 500 });
    }
}
