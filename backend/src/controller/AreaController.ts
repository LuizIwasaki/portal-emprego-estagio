import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Area } from "../database/models/Area";

export default class AreaController extends Area {

    constructor() {
        super();
    }

    async create(request: Request, response: Response) {
        const { nome } = request.body;
        const areaRepository = AppDataSource.getRepository(Area);
        const areaExists = await areaRepository.findOne({ where: { nome } });
        if (areaExists) {
            return response.status(422).json({ message: "Área já cadastrada" });
        }
        const area = areaRepository.create({
            nome
        });
        await areaRepository.save(area);
        return response.status(201).json(area);
    }

    async index(request: Request, response: Response) {
        const areaRepository = AppDataSource.getRepository(Area);
        try {
            const area = await areaRepository.find();
            return response.status(200).json(area);
        } catch (error) {
            return response.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async delete(request: Request, response: Response) {
        const { id } = request.params;
        const areaRepository = AppDataSource.getRepository(Area);
        const area = await areaRepository.findOneBy({ idArea: +id });
        if (!area) {
            return response.status(404).json({ message: "Área não encontrada" });
        }
        area.deletedAt = new Date();
        await areaRepository.save(area);
        return response.status(200).json({ message: "Área deletada" });
    }

    async update(request: Request, response: Response) {
        const { nome } = request.body;
        const areaRepository = AppDataSource.getRepository(Area);
        const { id } = request.params;

        try {
            const area = await areaRepository.findOneBy({ idArea: +id });
            if (!area) {
                return response.status(404).json({ message: "Área não encontrada" });
            }
            // Verifique se já existe outra área com o mesmo nome
            const areaWithSameName = await areaRepository.findOne({ where: { nome } });
            if (areaWithSameName && areaWithSameName.idArea !== area.idArea) {
                return response.status(422).json({ message: "Nome de área já existe" });
            }

            area.nome = nome;
            await areaRepository.save(area);
            return response.status(200).json(area);
        } catch (error) {
            return response.status(500).json({ message: "Erro interno do servidor" });
        }
    }
    

    async findById(request: Request, response: Response) {
        const { id } = request.params;
        const areaRepository = AppDataSource.getRepository(Area);
        try {
            const area = await areaRepository.findOneBy({ idArea: +id });
            if (!area) {
                return response.status(404).json({ message: "Área não encontrada" });
            }
            return response.status(200).json(area);
        } catch (error) {
            return response.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    
}

