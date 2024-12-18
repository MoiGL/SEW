import xml.etree.ElementTree as ET
from reportlab.pdfgen import canvas

def guardarCoordenadas(xml_file, svg_file, pdf_file):
    tree = ET.parse(xml_file)
    root = tree.getroot()
    namespace = "{http://www.uniovi.es}"

    # Extraer las coordenadas
    altitudes = []
    distancias = []

    distancia_acumulada = 0
    for tramo in root.find(f"{namespace}tramos").findall(f"{namespace}tramo"):
        distancia = float(tramo.get("distancia").replace("km", "")) * 1000  # Convertir a metros
        altitud = float(tramo.find(f"{namespace}altitud").text)

        distancia_acumulada += distancia
        distancias.append(distancia_acumulada)
        altitudes.append(altitud)

    generate_altimetry_svg(distancias, altitudes, svg_file)
    generate_altimetry_pdf(distancias, altitudes, pdf_file)

def generate_altimetry_svg(distancias, altitudes, svg_file):
    # Crear contenido SVG manualmente
    width = 800
    height = 400
    margin = 50

    max_altitud = max(altitudes)
    min_altitud = min(altitudes)
    escala_x = (width - 2 * margin) / max(distancias)
    escala_y = (height - 2 * margin) / (max_altitud - min_altitud)

    # Generar puntos escalados para la polilínea (invertir la altimetría para que la altitud máxima esté arriba)
    puntos = " ".join(
        f"{margin + distancia * escala_x},{height - margin - (altitud - min_altitud) * escala_y}"
        for distancia, altitud in zip(distancias, altitudes)
    )

    # Crear estructura SVG
    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">
        <rect width="{width}" height="{height}" fill="white"/>
        <polyline points="{puntos}" fill="none" stroke="blue" stroke-width="2"/>
        <text x="{margin}" y="{margin / 2}" font-size="14" fill="black">Altimetria del Circuito</text>
        
        <!-- Ejes -->
        <line x1="{margin}" y1="{height - margin}" x2="{width - margin}" y2="{height - margin}" stroke="black"/>
        <line x1="{margin}" y1="{margin}" x2="{margin}" y2="{height - margin}" stroke="black"/>
        
        <!-- Unidades de distancia (km) en el eje X -->
        <text x="{width - margin - 50}" y="{height - margin + 15}" font-size="12" fill="black">Distancia (km)</text>
        
        <!-- Unidades de altitud (m) en el eje Y -->
        <text x="{margin - 40}" y="{margin}" font-size="12" fill="black" transform="rotate(-90 {margin - 40},{margin})">Altitud (m)</text>
    </svg>'''

    with open(svg_file, "w") as svg:
        svg.write(svg_content)

    print(f"SVG generado correctamente en {svg_file}.")

def generate_altimetry_pdf(distancias, altitudes, pdf_file):
      # Crear contenido PDF manualmente
    width = 800
    height = 400
    margin = 50

    max_altitud = max(altitudes)
    min_altitud = min(altitudes)
    escala_x = (width - 2 * margin) / max(distancias)
    escala_y = (height - 2 * margin) / (max_altitud - min_altitud)

    c = canvas.Canvas(pdf_file, pagesize=(width, height))

    # Dibujar el marco
    c.setStrokeColor("black")
    c.rect(margin, margin, width - 2 * margin, height - 2 * margin, stroke=1, fill=0)

    # Dibujar los ejes con unidades
    c.setFont("Helvetica", 10)
    for i in range(0, int(max(distancias)) + 1, 1000):  # Unidades en el eje X cada 1 km
        x = margin + i * escala_x
        c.drawString(x, margin - 15, f"{i // 1000} km")
        c.line(x, margin, x, margin - 5)

    for i in range(int(min_altitud), int(max_altitud) + 1, 5):  # Unidades en el eje Y cada 5 m
        y = margin + (i - min_altitud) * escala_y
        c.drawString(margin - 40, y - 5, f"{i} m")
        c.line(margin - 5, y, margin, y)

    # Dibujar la polilínea punto a punto
    c.setStrokeColor("blue")
    c.setLineWidth(2)
    puntos = [
        (margin + distancia * escala_x, margin + (altitud - min_altitud) * escala_y)
        for distancia, altitud in zip(distancias, altitudes)
    ]
    for i in range(len(puntos) - 1):
        c.line(puntos[i][0], puntos[i][1], puntos[i + 1][0], puntos[i + 1][1])

    # Añadir título
    c.setFont("Helvetica-Bold", 14)
    c.drawString(width / 2 - 70, height - margin + 20, "Altimetría del Circuito")

    c.save()
    print(f"PDF generado correctamente en {pdf_file}.")


def main():
    # Definir los nombres de archivo
    xml_file = "xml/circuitoEsquema.xml"
    svg_file = "xml/perfil.svg"
    pdf_file = "xml/perfil.pdf"

    # Generar SVG y PDF a partir del XML
    guardarCoordenadas(xml_file, svg_file, pdf_file)

if __name__ == "__main__":
    main()
