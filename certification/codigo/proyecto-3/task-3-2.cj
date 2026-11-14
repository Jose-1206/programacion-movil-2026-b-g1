import std.collection.*
import std.env.*
import std.convert.*

let devices = ArrayList<(Int64, String)>()
let deviceIDs = HashSet<Int64>()

func distritoValido(distrito: String): Bool {
    return distrito == "Dongcheng" ||
           distrito == "Xicheng" ||
           distrito == "Haidian" ||
           distrito == "Chaoyang" ||
           distrito == "Fengtai"
}

func mostrarMaquinas() {
    println("=== MAQUINAS REGISTRADAS ===")
    println("Total: ${devices.size}")

    for (maquina in devices) {
        println("ID: ${maquina[0]}, Distrito: ${maquina[1]}")
    }
}

func agregarMaquina() {
    print("Ingrese el ID (1001-1100): ")
    let entrada = getStdIn().readln() ?? ""

    try {
        let id = Int64.parse(entrada)

        if (id < 1001 || id > 1100) {
            println("Error: ID fuera del rango.")
            return
        }

        if (deviceIDs.contains(id)) {
            println("Error: el ID ya existe.")
            return
        }

        print("Ingrese el distrito: ")
        let distrito = getStdIn().readln() ?? ""

        if (!distritoValido(distrito)) {
            println("Error: distrito no valido.")
            return
        }

        devices.add((id, distrito))
        deviceIDs.add(id)
        println("Maquina agregada correctamente.")
    } catch (e: Exception) {
        println("Error: ingrese un numero entero.")
    }
}

func eliminarMaquina() {
    print("ID de la maquina a eliminar: ")
    let entrada = getStdIn().readln() ?? ""

    try {
        let id = Int64.parse(entrada)

        if (!deviceIDs.contains(id)) {
            println("Error: la maquina no existe.")
            return
        }

        var indice: Int64 = 0

        while (indice < devices.size) {
            if (devices[indice][0] == id) {
                devices.remove(at: indice)
                deviceIDs.remove(id)
                println("Maquina eliminada correctamente.")
                return
            }
            indice++
        }
    } catch (e: Exception) {
        println("Error: ID no valido.")
    }
}

func modificarMaquina() {
    print("ID de la maquina a modificar: ")
    let entrada = getStdIn().readln() ?? ""

    try {
        let id = Int64.parse(entrada)

        if (!deviceIDs.contains(id)) {
            println("Error: la maquina no existe.")
            return
        }

        print("Ingrese el nuevo distrito: ")
        let nuevoDistrito = getStdIn().readln() ?? ""

        if (!distritoValido(nuevoDistrito)) {
            println("Error: distrito no valido.")
            return
        }

        var indice: Int64 = 0

        while (indice < devices.size) {
            if (devices[indice][0] == id) {
                devices[indice] = (id, nuevoDistrito)
                println("Maquina modificada correctamente.")
                return
            }
            indice++
        }
    } catch (e: Exception) {
        println("Error: ID no valido.")
    }
}

func buscarPorDistrito() {
    print("Ingrese el distrito a consultar: ")
    let distrito = getStdIn().readln() ?? ""

    if (!distritoValido(distrito)) {
        println("Error: distrito no valido.")
        return
    }

    println("=== MAQUINAS EN ${distrito} ===")

    var cantidad = 0

    for (maquina in devices) {
        if (maquina[1] == distrito) {
            println("ID: ${maquina[0]}")
            cantidad++
        }
    }

    println("Total encontrado: ${cantidad}")
}

main() {
    println("=== SISTEMA DE MAQUINAS EXPENDEDORAS ===")

    while (true) {
        println("")
        println("1. Mostrar maquinas")
        println("2. Agregar maquina")
        println("3. Eliminar maquina")
        println("4. Modificar maquina")
        println("5. Buscar por distrito")
        println("6. Salir")

        print("Seleccione una opcion: ")
        let opcion = getStdIn().readln() ?? ""

        match (opcion) {
            case "1" => mostrarMaquinas()
            case "2" => agregarMaquina()
            case "3" => eliminarMaquina()
            case "4" => modificarMaquina()
            case "5" => buscarPorDistrito()
            case "6" => break
            case _ => println("Opcion no valida")
        }
    }

    println("Programa finalizado.")
}
