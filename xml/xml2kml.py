import xml.etree.ElementTree as ET
import matplotlib.pyplot as plt
from reportlab.pdfgen import canvas

def xml_to_kml(xml_file, kml_file):
    tree = ET.parse(xml_file)
    root = tree.getroot()

    namespace = "{http://www.uniovi.es}"

    # Crear el contenido base del archivo KML
    kml_content = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<kml xmlns="http://www.opengis.net/kml/2.2">',
        '  <Document>',
        '    <name>Circuito</name>',
    ]

    # Agregar coordenadas desde los tramos del circuito
    kml_content.append('    <Placemark>')
    kml_content.append('      <name>Planimetría del Circuito</name>')
    kml_content.append('      <LineString>')
    kml_content.append('        <coordinates>')

    # Extraer las coordenadas
    latitudes = []
    longitudes = []
    altitudes = []

    for tramo in root.find(f"{namespace}tramos").findall(f"{namespace}tramo"):
        latitud = tramo.find(f"{namespace}latitud").text
        longitud = tramo.find(f"{namespace}longitud").text
        altitud = tramo.find(f"{namespace}altitud").text

        latitudes.append(float(latitud))
        longitudes.append(float(longitud))
        altitudes.append(float(altitud))

        kml_content.append(f"          {longitud},{latitud},{altitud}")

    kml_content.append('        </coordinates>')
    kml_content.append('      </LineString>')
    kml_content.append('    </Placemark>')

    kml_content.append('  </Document>')
    kml_content.append('</kml>')

    # Guardar el archivo KML
    with open(kml_file, 'w', encoding='utf-8') as file:
        file.write("\n".join(kml_content))

    print(f"KML generado correctamente en {kml_file}.")


def main():
    # Definir los nombres de archivo
    xml_file = "xml/circuitoEsquema.xml"
    kml_file = "xml/circuito.kml"

    # Convertir XML a KML
    xml_to_kml(xml_file, kml_file)

if __name__ == "__main__":
    main()