import {Request, Response} from "express";
import {AppDataSource} from "../database/data-source";
import {TipoServico} from "../database/models/TipoServico";

export default class TipoServicoController extends TipoServico {

    constructor() {
        super();
    }

    async create(request: Request, response: Response) {
        const {nome} = request.body;
        const tipoServicoRepository = AppDataSource.getRepository(TipoServico);
        const tipoExists = await tipoServicoRepository.findOne({where: {nome}});
        if (tipoExists) {
            return response.status(409).json({message: "Tipo de Servico já cadastrada"});
        }
        const tipoServico = tipoServicoRepository.create({
            nome
        });
        await tipoServicoRepository.save(tipoServico);
        return response.status(201).json(tipoServico);
    }

    async index(request: Request, response: Response) {
        const tipoServicoRepository = AppDataSource.getRepository(TipoServico);
        const tipoServico = await tipoServicoRepository.find();
        return response.status(200).json(tipoServico);
    }

    async delete(request: Request, response: Response) {
        const {id} = request.params;
        const tipoServicoRepository = AppDataSource.getRepository(TipoServico);
        const tipoServico = await tipoServicoRepository.findOneBy({idTipoServico: +id});
        if (!tipoServico) {
            return response.status(404).json({message: "Área não encontrada"});
        }
        tipoServico.deletedAt = new Date();
        await tipoServicoRepository.save(tipoServico);
        return response.status(200).json({message: "Área deletada"});
    }

    async find(request: Request, response: Response) {
        const {id} = request.params;
        const tipoServicoRepository = AppDataSource.getRepository(TipoServico);
        try {
            const tipoServico = await tipoServicoRepository.findOneBy({idTipoServico: +id});
            if (!tipoServico) {
                return response.status(404).json({message: "Tipo Servico não encontrada"});
            }
            return response.status(200).json(tipoServico);
        } catch (error) {
            return response.status(500).json({message: "Erro interno do servidor"});
        }
    }

    async update(request: Request, response: Response) {
        const {nome} = request.body;
        const {id} = request.params;

        const tipoServicoRepository = AppDataSource.getRepository(TipoServico);
        try {
            const tipoServico = await tipoServicoRepository.findOneBy({idTipoServico: +id});
            if (!tipoServico) {
                return response.status(404).json({message: "Área não encontrada"});
            }
            tipoServico.nome = nome;
            await tipoServicoRepository.save(tipoServico);
            return response.status(200).json(tipoServico);
        } catch (error) {
            return response.status(500).json({message: "Erro interno do servidor"});
        }
    }
}

