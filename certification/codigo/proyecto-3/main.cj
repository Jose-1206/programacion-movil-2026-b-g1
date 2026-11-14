import std.env.*
import std.convert.*
import std.fs.*

main() {
    println("=== REGISTRO DE MAQUINAS EXPENDEDORAS ===")

    var idValido = false
    var idMaquina: Int64 = 0

    while (!idValido) {
        print("Ingrese el ID de la maquina (1001-1100): ")
        let entrada = getStdIn().readln().getOrThrow()

        try {
            let id = Int64.parse(entrada)

            if (id < 1001 || id > 1100) {
                println("Error: el ID debe estar entre 1001 y 1100.")
                continue
            }

            var repetido = false

            if (exists("maquinas.txt")) {
                let contenido = String.fromUtf8(
                    File.readFrom("maquinas.txt")
                )

                for (linea in contenido.split("\n")) {
                    if (linea == entrada) {
                        repetido = true
                    }
                }
            }

            if (repetido) {
                println("Error: este ID ya esta registrado.")
            } else {
                idMaquina = id
                idValido = true
            }
        } catch (e: Exception) {
            println("Error: debe ingresar un numero entero.")
        }
    }

    var distritoValido = false
    var distrito = ""

    while (!distritoValido) {
        println("")
        println("Distritos disponibles:")
        println("Dongcheng, Xicheng, Haidian, Chaoyang, Fengtai")
        print("Ingrese el distrito: ")

        let entrada = getStdIn().readln().getOrThrow()

        if (entrada == "Dongcheng" ||
            entrada == "Xicheng" ||
            entrada == "Haidian" ||
            entrada == "Chaoyang" ||
            entrada == "Fengtai") {
            distrito = entrada
            distritoValido = true
        } else {
            println("Error: distrito no valido.")
        }
    }

    File.appendTo(
        "maquinas.txt",
        ("${idMaquina}\n").toArray()
    )

    println("")
    println("=== REGISTRO EXITOSO ===")
    println("ID de la maquina: ${idMaquina}")
    println("Distrito: ${distrito}")
}
