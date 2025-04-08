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

interface Inmueble {
    Codigo_Inmueble: string;
    IdInmobiliaria: string;
    fingreso: string;
    fecha_modificacion: string;
    Alcobas: string;
    banios: string;
    garaje: string;
    idEstado: string;
    estadoInmueble: string;
    Administracion: string;
    Estrato: string;
    idTipoInmueble: string;
    Tipo_Inmueble: string;
    Venta: string;
    Canon: string;
    valorFiltro: string;
    descripcionlarga: string;
    AreaConstruida: string;
    AreaLote: string;
    latitud: string;
    longitud: string;
    EdadInmueble: number;
    NombreInmo: string;
    foto1: string;
    logo: string;
    idGestion: string;
    Gestion: string;
    Barrio: string;
    Ciudad: string;
    Departamento: string;
    Zona: string;
    foto360: number;
    sede: string;
    id_sede: string;
    video360: null | string;
    amobladoInmueble: boolean;
    destacado: null | string;
    amoblado: number;
    inversion: null | string;
    admonIncluida: string;
}
  
interface DatosGenerales {
    inicio: number;
    fin: number;
    pagina_actual: string;
    totalInmuebles: number;
    totalPagina: string;
    valMaxVenta: string;
    valMinVenta: string;
    valMaxArriendo: string;
    valMinArriendo: string;
}

interface Isimidata {
    Inmuebles: Inmueble[];
    datosGrales: DatosGenerales;
}

export async function GET() {
    try {
        const hubspotToken = process.env.HUBSPOT_API_KEY; // Asegúrate de definir este token en tus variables de entorno
        const simiToken = process.env.SIMI_TOKEN;

        const urlHubspot = 'https://api.hubapi.com/crm/v3/objects/products';
        const urlSimi = 'https://simi-api.com/ApiSimiweb/response/v2.1.1/filtroInmueble/order/desc/limite/83/cantidad/1/total/10/order/desc/departamento/0/ciudad/0/zona/0/barrio/0/tipoInm/0/tipOper/0/areamin/0/areamax/0/valmin/0/valmax/0/banios/0/alcobas/0/garajes/0/sede/0/usuario/0';

        const responseSimi: any = await fetch(urlSimi, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${simiToken}`,
                'Content-Type': 'application/json'
            },
        });

        const dataSimi = await responseSimi.json();

        if (!dataSimi.Inmuebles[0]) {
            return Response.json({ error: "No se encontró el primer inmueble" }, { status: 404 });
        }

        const products: Inmueble = dataSimi.Inmuebles[0];
        
        // Configurar las propiedades del producto en HubSpot
        // const productData = {
        //     properties: {
        //         name: `${products.Tipo_Inmueble}-${products.Codigo_Inmueble}`,
        //         hs_sku: products.Codigo_Inmueble,
        //         codigo_inmueble: products.Codigo_Inmueble,
        //         fingreso: products.fingreso, // Descripción del producto
        //         alcobas: products.Alcobas, // Precio del producto
        //         banios: products.banios, // Tipo de producto (opcional)
        //         garaje: products.garaje, // Código SKU del producto
        //         estadoinmueble: products.estadoInmueble, // Precio en HubSpot
        //         administracion: products.Administracion,
        //         estrato: products.Estrato,
        //         tipo_inmueble: products.Tipo_Inmueble,
        //         gestion: products.Gestion,
        //         price: parseFloat(products.Venta.replace(/,/g, '')),
        //         venta: products.Venta,
        //         canon: products.Canon,
        //         valorfiltro: products.valorFiltro,
        //         descripcionlarga: products.descripcionlarga,
        //         areaconstruida: products.AreaConstruida,
        //         arealote: products.AreaLote,
        //         latitud: products.latitud,
        //         longitud: products.longitud,
        //         foto1: products.foto1,
        //         logo: products.logo,
        //         barrio: products.Barrio,
        //         ciudad: products.Ciudad,
        //         departamento: products.Departamento,
        //         zona: products.Zona,
        //         foto360: products.foto360,
        //         sede: products.sede,
        //         amobladoinmueble: products.amobladoInmueble,
        //         amoblado: products.amoblado,
        //         inversion: products.inversion || '',
        //         admonincluida: products.admonIncluida
        //     }
        // };

        const productPayload = dataSimi.Inmuebles.map((product: Inmueble) => ({
            properties: {
                name: `${product.Tipo_Inmueble}-${product.Codigo_Inmueble}`,
                hs_sku: product.Codigo_Inmueble,
                codigo_inmueble: product.Codigo_Inmueble,
                fingreso: product.fingreso, // Descripción del producto
                alcobas: product.Alcobas, // Precio del producto
                banios: product.banios, // Tipo de producto (opcional)
                garaje: product.garaje, // Código SKU del producto
                estadoinmueble: product.estadoInmueble, // Precio en HubSpot
                administracion: product.Administracion,
                estrato: product.Estrato,
                tipo_inmueble: product.Tipo_Inmueble,
                gestion: product.Gestion,
                price: parseFloat(product.Venta.replace(/,/g, '')),
                venta: product.Venta,
                canon: product.Canon,
                valorfiltro: product.valorFiltro,
                descripcionlarga: product.descripcionlarga,
                areaconstruida: product.AreaConstruida,
                arealote: product.AreaLote,
                latitud: product.latitud,
                longitud: product.longitud,
                foto1: product.foto1,
                logo: product.logo,
                barrio: product.Barrio,
                ciudad: product.Ciudad,
                departamento: product.Departamento,
                zona: product.Zona,
                foto360: product.foto360,
                sede: product.sede,
                amobladoinmueble: product.amobladoInmueble,
                amoblado: product.amoblado,
                inversion: product.inversion || '',
                admonincluida: product.admonIncluida
            },
          }));

          

        // // Realizar la solicitud a HubSpot
        // const response = await fetch(urlHubspot, {
        //     method: 'POST',
        //     headers: {
        //         'Authorization': `Bearer ${hubspotToken}`,
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(productData)
        // });

        // const data = await response.json();

        // return Response.json(data, { status: response.status });

        // Send products in batches
    const responses = await Promise.all(
        productPayload.map(async (chunk: any) => {
          return fetch(urlHubspot, {
                method: 'POST',
                headers: {
                     'Authorization': `Bearer ${hubspotToken}`,
                     'Content-Type': 'application/json'
                 },
                 body: JSON.stringify(chunk)
            });
        })
      );
  
      return Response.json({ message: "Products added successfully", data: responses.map((r: any) => r.data) });
    } catch (error) {
        console.error("Error creando el producto en HubSpot:", error);
        return Response.json({ error: "Error creando el producto" }, { status: 500 });
    }
}
