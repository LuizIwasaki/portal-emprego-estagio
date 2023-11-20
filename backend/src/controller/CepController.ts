import {Ceps} from "../database/models/Ceps";
import { Request, Response } from "express";
import {AppDataSource} from "../database/data-source";

// Controller de Cep onde é feito a comunicação com o banco de dados
// As requisições são feitas através do método request e response
// Usando o padrao REST
export default class CepController extends Ceps {

    constructor() {
        super();
    }

    // Get all
    async index(request: Request, response: Response) {
        try {
            const cepRepository = AppDataSource.getRepository(Ceps);
            const ceps = await cepRepository.find();
            return response.status(200).json(ceps);
        }catch (err){
            return response.status(500).json({ message: "Erro interno do servidor" });
        }
    }


    // Get by cep

    async find(request: Request, response: Response) {
        const { cep } = request.params;
        const cepRepository = AppDataSource.getRepository(Ceps);
        try {
            const ceps = await cepRepository.findOneBy({ cep: +cep });
            if (!ceps) {
                return response.status(404).json({ message: "Cep não encontrado" });
            }
            return response.status(200).json(ceps);
        } catch (error) {
            return response.status(500).json({ message: "Erro interno do servidor" });
        }
    }

}