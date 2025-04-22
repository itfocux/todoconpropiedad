import { NextResponse } from 'next/server';

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
  const { codigo_inmueble } = await req.json();

  try {
    if (!HUBSPOT_API_KEY) {
        return NextResponse.json(
            { success: false, message: "HubSpot token is missing" },
            { status: 500 }
        );
    }

    const responseSimi: any = await fetch(urlSimi + codigo_inmueble, {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${SIMI_TOKEN}`,
            'Content-Type': 'application/json'
        },
    });

    const product: Inmueble = await responseSimi.json();

    if (!product.idInm) {
        return NextResponse.json({ message: 'No se encontro un producto con el codigo entregado' }, { status: 404 });
    }

    const asesorProduct = `${product.asesor[0].ntercero} - ${product.asesor[0].correo}`
    const captadorProduct = `${product.captador[0].ntercero} - ${product.captador[0].correo}`

    const dataInmuebleCreate: any= { properties: {
        name: `${product.Tipo_Inmueble} en ${product.Gestion} ${product.barrio} ${product.ciudad}`,
        hs_sku: product.idInm,
        codigo_inmueble: product.idInm,
        fingreso: product.FConsignacion,
        alcobas: product.alcobas,
        banios: product.banos,
        garaje: product.garaje,
        estadoinmueble: product.DescEstado,
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
        admonincluida: product.AdmonIncluida,
        asesor: asesorProduct,
        captador:captadorProduct
    }}

    const dataInmuebleUpdate: any= { properties: {
        name: `${product.Tipo_Inmueble} en ${product.Gestion} ${product.barrio} ${product.ciudad}`,
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
        admonincluida: product.AdmonIncluida,
        asesor: asesorProduct,
        captador:captadorProduct
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

    if (!productId) {
      return NextResponse.json({ message: 'No se encontro ni se creo el producto' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Producto actualizado correctamente', productId });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
