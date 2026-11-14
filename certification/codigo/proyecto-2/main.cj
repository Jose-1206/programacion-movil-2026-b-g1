import std.fs.*

main() {
    println("=== SISTEMA DE DATOS DEL CAMPUS ===")
    println("")
    println("1. Consultar temperatura")
    println("2. Consultar humedad")
    println("3. Consultar estudiantes presentes")
    println("4. Ver todos los registros")
    println("5. Buscar registros de temperatura")
    println("6. Buscar registros de humedad")
    println("7. Buscar registros de estudiantes")
    println("")

    print("Seleccione una opcion: ")
    let opcion = readln()

    var registro = ""

    if (opcion == "1") {
        registro = "Temperatura: 28 grados"
    } else if (opcion == "2") {
        registro = "Humedad: 65%"
    } else if (opcion == "3") {
        registro = "Estudiantes presentes: 120"
    } else if (opcion == "4") {
        if (exists("log.txt")) {
            let contenido = File.readFrom("log.txt")
            println("=== TODOS LOS REGISTROS ===")
            println(String.fromUtf8(contenido))
        } else {
            println("Todavia no hay registros.")
        }
    } else if (opcion == "5" || opcion == "6" || opcion == "7") {
        if (exists("log.txt")) {
            let contenido = String.fromUtf8(File.readFrom("log.txt"))
            let lineas = contenido.split("\n")

            var filtro = ""

            if (opcion == "5") {
                filtro = "Temperatura:"
            } else if (opcion == "6") {
                filtro = "Humedad:"
            } else {
                filtro = "Estudiantes presentes:"
            }

            println("=== REGISTROS FILTRADOS ===")

            var encontrados = 0

            for (linea in lineas) {
                if (linea.startsWith(filtro)) {
                    println(linea)
                    encontrados++
                }
            }

            if (encontrados == 0) {
                println("No se encontraron registros.")
            }
        } else {
            println("Todavia no hay registros.")
        }
    } else {
        println("Opcion no valida")
    }

    if (registro != "") {
        println(registro)
        File.appendTo("log.txt", (registro + "\n").toArray())
        println("Registro guardado en log.txt")
    }
}
