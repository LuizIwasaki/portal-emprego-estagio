import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { hash } from "bcrypt";
import { TipoUsuario } from "../../../shared/enums/TipoUsuario";
import { Administrador } from "../database/models/Administrador";

export default class AdminController extends Administrador{

    constructor() {
        super();
    }

    async create(request: Request, response: Response) {
        const { nome, email, senha, tipo } = request.body;
        const adminRepository = AppDataSource.getRepository(Administrador);
        const adminExists = await adminRepository.findOne({ where: { email } });
        if (adminExists) {
            return response.status(409).json({ message: "Já existe um usuário com esse email" });
        }

        const passHash = await hash(senha, 8);
        const admin = adminRepository.create({
            nome,
            email,
            senha: passHash,
            tipo: TipoUsuario.ADMINISTRADOR
        });

        await adminRepository.save(admin);
        return response.status(201).json(admin);
    }

    async index(request: Request, response: Response) {
        const adminRepository = AppDataSource.getRepository(Administrador);

        const admin = await adminRepository.find();

        return response.status(200).json(admin);
    }

    async delete(request: Request, response: Response) {
        const { id } = request.params;
        const adminRepository = AppDataSource.getRepository(Administrador);
        const admin = await adminRepository.findOneBy({ idAdministrador: +id});
        if (!admin) {
            return response.status(404).json({ message: "Usuário não encontrado" });
        }
        admin.deletedAt = new Date();
        await adminRepository.save(admin);
        return response.status(200).json({ message: "Usuário deletado" });
    }

    async find(request: Request, response: Response) {
        const { id } = request.params;
        
        const adminRepository = AppDataSource.getRepository(Administrador);
        try {
            const admin = await adminRepository.findOneBy({ idAdministrador: +id });
            if (!admin) {
                return response.status(404).json({ message: "Administrador não encontrado" });
            }
            return response.status(200).json(admin);
        } catch (error) {
            console.log(error);
            return response.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    async update(request: Request, response: Response) {
        const { nome, email, senha } = request.body;
        const { id } = request.params;

        const adminRepository = AppDataSource.getRepository(Administrador);

        try {
            const admin = await adminRepository.findOneBy({ idAdministrador: +id });
            if (!admin) {
                return response.status(404).json({ message: "Administrador não encontrado" });
            }
            admin.nome = nome;
            admin.email = email;
            await adminRepository.save(admin);
            return response.status(200).json(admin);
        } catch (error) {
            console.log(error);
            return response.status(500).json({ message: "Erro interno do servidor" });
        }
    }
}
