import { hash } from "bcrypt";
import { AppDataSource } from "../database/data-source";
import { Request, Response } from "express";
import { TipoUsuario } from "../../../shared/enums/TipoUsuario";
import { Equipe } from "../database/models/Equipe";
import { Vaga } from "../database/models/Vaga";
import { DeepPartial } from "typeorm";

export default class EquipeController extends Equipe{

    constructor() {
        super();
    }
    
    async create(request: Request, response: Response) {
        const { nome, email, senha, tipo, idArea } = request.body;
        const equipeRepository = AppDataSource.getRepository(Equipe);
        const equipeExists = await equipeRepository.findOne({ where: { email } });
        if (equipeExists) {
            return response.status(409).json({ message: "Já existe um usuário com esse email" });
        }
        const passHash = await hash(senha, 8);
        const equipe = equipeRepository.create({
            nome,
            email,
            senha: passHash,
            tipo: TipoUsuario.EQUIPE
        });
        await equipeRepository.save(equipe);
        return response.status(201).json(equipe);
    }

    async index(request: Request, response: Response) {
        const equipeRepository = AppDataSource.getRepository(Equipe);
        const equipe = await equipeRepository.find();
        return response.status(200).json(equipe);
    }

    async delete(request: Request, response: Response) {
        const { id } = request.params;
        const equipeRepository = AppDataSource.getRepository(Equipe);
        const equipe = await equipeRepository.findOneBy({idEquipe: +id});
        if (!equipe) {
            return response.status(404).json({ message: "Usuário não encontrado" });
        }
        equipe.deletedAt = new Date();
        await equipeRepository.save(equipe);
        return response.status(200).json({ message: "Usuário deletado" });
    }

    async find(request: Request, response: Response) {
        const { id } = request.params;
        const equipeRepository = AppDataSource.getRepository(Equipe);
        try {
            const equipe = await equipeRepository.findOneBy({idEquipe: +id});
            if (!equipe) {
                return response.status(404).json({ message: "Usuário não encontrado" });
            }
            return response.status(200).json(equipe);
        } catch (error) {
            return response.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async update(request: Request, response: Response) {
    
        const { nome, email, senha } = request.body;
        const equipeRepository = AppDataSource.getRepository(Equipe);
        const { id } = request.params;
        try {
            const equipe = await equipeRepository.findOneBy({idEquipe: +id});
            if (!equipe) {
                return response.status(404).json({ message: "Usuário não encontrado" });
            }
            equipe.nome = nome;
            equipe.email = email;
            equipe.senha = senha;
            await equipeRepository.save(equipe);
            return response.status(200).json(equipe);
        } catch (error) {
            return response.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async publishVaga(request: Request, response: Response) {
        const { id } = request.params;
        const { idVaga } = request.body;
        const equipeRepository = AppDataSource.getRepository(Equipe);
        const vagaRepository = AppDataSource.getRepository(Vaga);
        try {
            const equipe = await equipeRepository.findOneBy({idEquipe: +id});
            if (!equipe) {
                return response.status(404).json({ message: "Usuário não encontrado" });
            }
            const vaga = await vagaRepository.findOneBy({idVaga: +idVaga});
            if (!vaga) {
                return response.status(404).json({ message: "Vaga não encontrada" });
            }
            vaga.idEquipe = equipe.idEquipe;
            await vagaRepository.save(vaga);
            return response.status(200).json(vaga);
        } catch (error) {
            return response.status(500).json({ message: "Erro interno do servidor" });
        }
    }
        
    };
