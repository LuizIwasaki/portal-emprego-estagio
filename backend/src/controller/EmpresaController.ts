import { Request, Response } from "express";
import { Empresa } from "../database/models/Empresa";
import { Contato } from "../database/models/Contato";
import { hash } from "bcrypt";
import { AppDataSource } from "../database/data-source";

export default class EmpresaController extends Empresa {

    constructor() {
        super();
    }

    async create(request: Request, response: Response) {
        const {
            nomeEmpresa,
            cnpj,
            email,
            senha,
            cep,
            uf,
            cidade,
            logradouro,
            numero,
            complemento,
            tipo,
            site,
            idArea,
            contatos,
        } = request.body;

        const empresaRepository = AppDataSource.getRepository(Empresa);
        const contatoRepository = AppDataSource.getRepository(Contato);

        const empresaWithEmail = await empresaRepository.findOne({ where: { email } });
        const empresaWithCNPJ = await empresaRepository.findOne({ where: { cnpj } });

        if (empresaWithEmail && empresaWithEmail.deletedAt == null) {
            return response.status(409).json({ message: "Empresa com o mesmo email já cadastrada" });
        }

        if (empresaWithCNPJ && empresaWithCNPJ.deletedAt == null) {
            return response.status(409).json({ message: "Empresa com o mesmo CNPJ já cadastrada" });
        }

        const passHash = await hash(senha, 8);

        try {
            const empresa = empresaRepository.create({
                nomeEmpresa,
                cnpj,
                email,
                senha: passHash,
                cep,
                uf,
                cidade,
                logradouro,
                numero,
                complemento,
                tipo,
                site,
                idArea,
            });

            // Salve a empresa no banco de dados
            await empresaRepository.save(empresa);

            // Agora, adicione os contatos
            for (const contatoData of contatos) {
                const { contato, tipoContato } = contatoData;
                const contatoEntity = contatoRepository.create({
                    contato,
                    tipoContato,
                    idEmpresa2: empresa,
                });
                await contatoRepository.save(contatoEntity);
            }

            return response.status(201).json(empresa);
        } catch (error) {
            console.log(error);
            return response.status(500).json({ message: "Erro interno no servidor" });
        }
    }


    async index(request: Request, response: Response) {
        const empresaRepository = AppDataSource.getRepository(Empresa);

        try {
            const empresas = await empresaRepository
                .createQueryBuilder('empresa')
                .where('empresa.deletedAt IS NULL')
                .leftJoinAndSelect('empresa.contatos', 'contatos')
                .getMany();

            return response.status(200).json(empresas);
        } catch (error) {
            console.log(error);
            return response.status(500).json({ message: "Erro interno no servidor" });
        }
    }



    async update(request: Request, response: Response) {
        const {
            nomeEmpresa,
            cnpj,
            email,
            senha,
            cep,
            uf,
            cidade,
            logradouro,
            numero,
            complemento,
            tipo,
            site,
            idArea,
            contatos,
        } = request.body;
        const { id } = request.params;
        const empresaRepository = AppDataSource.getRepository(Empresa);
        const contatoRepository = AppDataSource.getRepository(Contato);

        const empresaExists = await empresaRepository.findOneBy({ idEmpresa: +id });
        if (!empresaExists) {
            return response.status(404).json({ message: "Empresa não cadastrada" });
        }

        const empresaWithEmail = await empresaRepository.findOne({ where: { email } });
        const empresaWithCNPJ = await empresaRepository.findOne({ where: { cnpj } });

        if (empresaWithEmail && empresaWithEmail.deletedAt == null && empresaWithEmail.idEmpresa !== empresaExists.idEmpresa) {
            return response.status(409).json({ message: "Empresa com o mesmo email já cadastrada" });
        }

        if (empresaWithCNPJ && empresaWithCNPJ.deletedAt == null && empresaWithCNPJ.idEmpresa !== empresaExists.idEmpresa) {
            return response.status(409).json({ message: "Empresa com o mesmo CNPJ já cadastrada" });
        }


        try {
            // Exclua todos os contatos associados a essa empresa
            await contatoRepository
                .createQueryBuilder()
                .delete()
                .from(Contato)
                .where("idEmpresa2 = :idEmpresa", { idEmpresa: empresaExists.idEmpresa })
                .execute();

            let passHash;
            if (senha) {
                passHash = await hash(senha, 8);
            } else {
                passHash = empresaExists.senha;
            }
            empresaExists.nomeEmpresa = nomeEmpresa;
            empresaExists.cnpj = cnpj;
            empresaExists.email = email;
            empresaExists.senha = passHash;
            empresaExists.cep = cep;
            empresaExists.uf = uf;
            empresaExists.cidade = cidade;
            empresaExists.logradouro = logradouro;
            empresaExists.numero = numero;
            empresaExists.complemento = complemento;
            empresaExists.tipo = tipo;
            empresaExists.site = site;
            empresaExists.idArea = idArea;

            // Adicione os novos contatos
            for (const contatoData of contatos) {
                const { contato, tipoContato } = contatoData;
                const contatoEntity = contatoRepository.create({
                    contato,
                    tipoContato,
                    idEmpresa2: empresaExists,
                });
                await contatoRepository.save(contatoEntity);
            }

            const empresa = empresaRepository.create(empresaExists);
            await empresaRepository.save(empresa);

            return response.status(200).json(empresa);
        } catch (error) {
            return response.status(500).json({ message: "Erro interno do servidor" });
        }
    }



    async delete(request: Request, response: Response) {
        const { id } = request.params;
        const empresaRepository = AppDataSource.getRepository(Empresa);
        const contatoRepository = AppDataSource.getRepository(Contato);

        const empresa = await empresaRepository.findOne({ where: { idEmpresa: +id } });

        if (!empresa) {
            return response.status(404).json({ message: "Empresa não encontrada" });
        }

        try {
            // Antes de deletar a empresa, vamos deletar todos os contatos associados a ela
            await contatoRepository
                .createQueryBuilder()
                .delete()
                .from(Contato)
                .where("idEmpresa2 = :idEmpresa", { idEmpresa: empresa.idEmpresa })
                .execute();

            // Agora, você pode marcar a empresa como deletada
            empresa.deletedAt = new Date();
            await empresaRepository.save(empresa);

            return response.status(200).json({ message: "Empresa deletada" });
        } catch (error) {
            return response.status(500).json({ message: "Erro interno do servidor" });
        }
    }


    async findById(request: Request, response: Response) {
        const { id } = request.params;
        const empresaRepository = AppDataSource.getRepository(Empresa);
        const contatoRepository = AppDataSource.getRepository(Contato);

        try {
            const empresa = await empresaRepository.findOneBy({ idEmpresa: +id });
            const contatosEmpresa = await empresaRepository.find({ relations: ["contatos"] });

            if (!empresa) {
                return response.status(404).json({ message: "Empresa não encontrada" });
            }

            let contatosRetornados: Contato[] = [];

            if (empresa.idEmpresa) {
                contatosRetornados = await contatoRepository
                    .createQueryBuilder("contato")
                    .where("contato.idEmpresa2 = :idEmpresa", { idEmpresa: empresa.idEmpresa })
                    .getMany();
            }

            empresa.contatos = contatosRetornados;

            return response.status(200).json(empresa);
        } catch (error) {
            return response.status(500).json({ message: "Erro interno do servidor" });
        }
    }

}
