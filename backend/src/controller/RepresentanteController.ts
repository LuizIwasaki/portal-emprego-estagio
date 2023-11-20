import { hash } from "bcrypt";
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Representante } from "../database/models/Representante";
import { AppDataSource } from "../database/data-source";

export default class RepresentanteController extends Representante {

    constructor() {
        super();
    }

    async create(request: Request, response: Response) {
        try {
            const {
                nome,
                email,
                senha,
                tipo,
                idEmpresa,
            } = request.body;

            const representanteRepository = AppDataSource.getRepository(Representante);
            const representanteExists = await representanteRepository.findOne({
                where: { email },
            });
            if (representanteExists && representanteExists.deletedAt==null) {
                return response.status(409).json({ message: "Representante com o mesmo email já cadastrado" });
            }
            const passHash = await hash(senha, 8);
            const representante = representanteRepository.create({
                nome,
                email,
                senha: passHash,
                tipo,
                idEmpresa,
            });
            await representanteRepository.save(representante);
            return response.status(201).json(representante);
        } catch (error) {
            return response.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async index(request: Request, response: Response) {
        const representanteRepository = AppDataSource.getRepository(Representante);
        try {
            const representantes = await representanteRepository
                .createQueryBuilder('representante')
                .where('representante.deletedAt IS NULL').getMany();
            return response.status(200).json(representantes);
        } catch (error) {
            return response.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async update(request: Request, response: Response) {
        const {
            nome,
            email,
            senha,
            idEmpresa,
        } = request.body;
        const { id } = request.params;
        const representanteRepository = AppDataSource.getRepository(Representante);
        try {
            const representanteExists = await representanteRepository.findOneBy({ idRepresentante: +id });
            if (!representanteExists) {
                return response.status(404).json({ message: "Representante não cadastrado" });
            }

            const representanteWithEmail = await representanteRepository.findOne({ where: { email } });
            
            if (representanteWithEmail && representanteWithEmail.deletedAt==null && representanteWithEmail.idRepresentante !== representanteExists.idRepresentante) {
                return response.status(409).json({ message: "Representante com o mesmo email já cadastrado" });
            }

            let passHash;
            if (senha) {
                passHash = await hash(senha, 8);
            } else {
                passHash = representanteExists.senha;
            }
            representanteExists.nome = nome;
            representanteExists.email = email;
            representanteExists.senha = passHash;
            representanteExists.idEmpresa = idEmpresa;
            await representanteRepository.save(representanteExists);
            return response.status(200).json(representanteExists);
        } catch (error) {
            return response.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async delete(request: Request, response: Response) {
        const { id } = request.params;
        const representanteRepository = AppDataSource.getRepository(Representante);
        try {
            const representante = await representanteRepository.findOneBy({ idRepresentante: +id });
            if (!representante) {
                return response.status(404).json({ message: "Representante não encontrado" });
            }
            representante.deletedAt = new Date();
            await representanteRepository.save(representante);
            return response.status(200).json({ message: "Representante deletado" });
        } catch (error) {
            return response.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async findById(request: Request, response: Response) {
        const { id } = request.params;
        const representanteRepository = AppDataSource.getRepository(Representante);
        
        try {
            const representante = await representanteRepository.findOneBy({idRepresentante: +id});
            if (!representante) {
                return response.status(404).json({ message: "Representante não encontrado" });
            }
            return response.status(200).json(representante);
        } catch (error) {
            return response.status(500).json({ message: "Erro interno do servidor" });
        }
    }
}
