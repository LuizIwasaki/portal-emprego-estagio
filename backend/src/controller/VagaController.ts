import {Request, Response} from "express";
import {Vaga} from "../database/models/Vaga";
import {Empresa} from "../database/models/Empresa";
import {Equipe} from "../database/models/Equipe";
import {Area} from "../database/models/Area";
import {Candidato} from "../database/models/Candidato";
import {Administrador} from "../database/models/Administrador";
import {Between, DeepPartial, IsNull, Like, Not} from "typeorm";
import {AppDataSource} from "../database/data-source";
import {sendEmailCurriculum, sendEmailNotification} from './EmailController'

export default class VagaController extends Vaga {

    constructor() {
        super();
    }

    async create(request: Request, response: Response) {
        try {
            const vagaRepository = AppDataSource.getRepository(Vaga);
            const areaRepository = AppDataSource.getRepository(Area);
    
            const area = await areaRepository.findOneBy({ idArea: request.body.idArea });
    
            if (!area) {
                return response.status(404).json({ message: "Área não encontrada" });
            }
    
            const createdAt = new Date();
            let {
                idAdministrador,
                idEquipe,
                idEmpresa,
                ...vagaData
            } = request.body;
            
            idAdministrador = idAdministrador === 0 ? null : idAdministrador;
            idEquipe = idEquipe === 0 ? null : idEquipe;
            idEmpresa = idEmpresa === 0 ? null : idEmpresa;
    
            const vagaCreated = vagaRepository.create({
                ...vagaData,
                idAdministrador,
                idEquipe,
                idEmpresa,
                idArea: area.idArea,
                createdAt,
            });
    
            await vagaRepository.save(vagaCreated);
    
            await notificarCandidatos(vagaCreated);
    
            return response.status(200).json(vagaCreated);
        } catch (error) {
            console.log("Error creating vaga:", error);
            return response.status(500).json({ message: "Internal Server Error" });
        }
    }
    

    async indexTodas(request: Request, response: Response) {
        const vagaRepository = AppDataSource.getRepository(Vaga);
        const vagas = await vagaRepository.find();
        return response.status(200).json(vagas);
    }

    async indexEmpresa(request: Request, response: Response) {
        try {
            const {id} = request.params; // Assume que o idEmpresa é passado como um parâmetro na URL
            const vagaRepository = AppDataSource.getRepository(Vaga);
            // Se o idEmpresa não for fornecido, retorna um erro
            if (!id) {
                return response.status(400).json({error: 'O parâmetro idEmpresa é obrigatório.'});
            }
            // Converte o idEmpresa para o tipo correto (neste caso, número)
            const idEmpresaNumber = parseInt(id, 10);
            const vagas = await vagaRepository.find({where: {idEmpresa: idEmpresaNumber}});
            return response.status(200).json(vagas);
        } catch (error) {
            console.log(error);
            return response.status(500).json({error: 'Erro interno do servidor.'});
        }
    }

    async indexEquipe(request: Request, response: Response) {
        try {
            const vagaRepository = AppDataSource.getRepository(Vaga);
            const vagas = await vagaRepository.find({where: {idEquipe: Not(IsNull())}});

            return response.status(200).json(vagas);
        } catch (error) {
            console.error(error);
            return response.status(500).json({error: 'Erro interno do servidor.'});
        }
    }

    async update(request: Request, response: Response) {
        try {
            const vagaRepository = AppDataSource.getRepository(Vaga);
            const areaRepository = AppDataSource.getRepository(Area);
    
            const area = await areaRepository.findOneBy({ idArea: request.body.idArea });
    
            if (!area) {
                return response.status(404).json({ message: "Área não encontrada" });
            }
    
            const {
                idAdministrador,
                idEquipe,
                idEmpresa,
                ...vagaData
            } = request.body;
            
            const vaga = await vagaRepository.findOne({where: {idVaga: vagaData.idVaga}});
    
            if (!vaga) {
                return response.status(404).json({ message: "Vaga não encontrada" });
            }
            console.log("vaga: ", vaga);
    
            vagaRepository.merge(vaga, {
                ...vagaData,
                idAdministrador,
                idEquipe,
                idEmpresa,
                idArea: area.idArea,
            });
    
            await vagaRepository.save(vaga);
            console.log("vaga: ", vaga);
            await notificarCandidatos(vaga);
    
            return response.status(200).json(vaga);
        } catch (error) {
            console.log("Error creating vaga:", error);
            return response.status(500).json({ message: "Internal Server Error" });
        }
    }

    async deleteByADM(request: Request, response: Response) {
        const {id} = request.params;
        const {idAdministradorExcluiu} = request.query; // Adiciona essa linha para obter o parâmetro da query
        const vagaRepository = AppDataSource.getRepository(Vaga);
        const vaga = await vagaRepository.findOneBy({idVaga: +id});
        if (!vaga) {
            return response.status(404).json({message: "Vaga não encontrada"});
        }
        if (idAdministradorExcluiu) {
            vaga.idAdministradorExcluiu = +idAdministradorExcluiu;
        }
        vaga.deletedAt = new Date();
        await vagaRepository.save(vaga);
        return response.status(200).json({message: "A Vaga foi removida"});
    }

    async deleteByEquipe(request: Request, response: Response) {
        const {id} = request.params;
        const {idEquipeExcluiu} = request.query; // Adiciona essa linha para obter o parâmetro da query
        const vagaRepository = AppDataSource.getRepository(Vaga);
        const vaga = await vagaRepository.findOneBy({idVaga: +id});
        if (!vaga) {
            return response.status(404).json({message: "Vaga não encontrada"});
        }
        if (idEquipeExcluiu) {
            vaga.idEquipeExcluiu = +idEquipeExcluiu;
        }
        vaga.deletedAt = new Date();
        await vagaRepository.save(vaga);
        return response.status(200).json({message: "A Vaga foi removida"});
    }

    async deleteByRepresentante(request: Request, response: Response) {
        const {id} = request.params;
        const {idRepresentanteExcluiu} = request.query; // Adiciona essa linha para obter o parâmetro da query
        const vagaRepository = AppDataSource.getRepository(Vaga);
        const vaga = await vagaRepository.findOneBy({idVaga: +id});
        if (!vaga) {
            return response.status(404).json({message: "Vaga não encontrada"});
        }
        if (idRepresentanteExcluiu) {
            vaga.idRepresentanteExcluiu = +idRepresentanteExcluiu;
        }
        vaga.deletedAt = new Date();
        await vagaRepository.save(vaga);
        return response.status(200).json({message: "A Vaga foi removida"});
    }

    async findById(request: Request, response: Response) {
        const { id } = request.params;
        const vagaRepository = AppDataSource.getRepository(Vaga);
    
        try {
            const vaga = await vagaRepository.findOne({ 
                where: { idVaga: +id },
                relations: ["candidatos"] // Carrega os candidatos associados à vaga
            });
    
            if (!vaga) {
                return response.status(404).json({ message: "Vaga não encontrada" });
            }

            const vagaToSend = {
                titulo_vaga: vaga.titulo_vaga,
                descricao: vaga.descricao,
                salario: vaga.salario,
                local: vaga.cidade + ' - ' + vaga.uf,
                maisInfo: vaga.tipo_vaga + ' - ' + vaga.modalidade + ' - ' + vaga.regime,
            }

                // await sendEmailNotification(candidato, vaga.titulo_vaga, '', "perfeita");

            return response.status(200).json(vaga);
        } catch (error) {
            return response.status(500).json({ message: "Erro interno do servidor" });
        }
    }
    

    async candidatar(request: Request, response: Response) {
        const {idVaga, idCandidato} = request.body;


        const vagaRepository = AppDataSource.getRepository(Vaga);
        const candidatoRepository = AppDataSource.getRepository(Candidato);

        const vaga = await vagaRepository.findOne({where: {idVaga: +idVaga}, relations: ['candidatos']});
        const candidato = await candidatoRepository.findOneBy({idCandidato});

        if (!vaga) {
            return response.status(404).json({message: "Vaga não encontrada"});
        }

        if (!candidato) {
            return response.status(404).json({message: "Candidato não encontrado"});
        }

        try {

            if (vaga.email_curriculo == null) {
                return response.status(400).json({message: "A vaga não possui email para envio de curriculo"});
            }

            if (vaga.candidatos == null) {
                vaga.candidatos = [];
            }

            // Verifica se o candidato já está cadastrado na vaga
            const candidatoJaCadastrado = vaga.candidatos.find(candidato => candidato.idCandidato === +idCandidato);


            if (candidatoJaCadastrado) {
                return response.status(400).json({message: "Curriculo já enviado para esta vaga"});
            }

            vaga.candidatos.push(candidato);

            const vagaCreated = vagaRepository.create(vaga);



            const body = {
                candidato,
                vaga,
            }



            await sendEmailCurriculum(vaga.email_curriculo, candidato.curriculo, candidato.pcd, body);

            await vagaRepository.save(vagaCreated);


            return response.status(200).json({message: "Curriculo enviado com sucesso"});


        } catch (error) {
            console.error(error);
            return response.status(500).json({message: "Erro interno do servidor"});
        }

    }


}

// Esta função deve ser executadada depois que a vaga for criada
// Ela deve notificar os candidatos que tem atributos iguais aos da vaga
// Vai gerar uma lista para os candidatos que tem todos os atributos iguais a vaga
// E uma lista com os candidatos que tem pelo menos um atributo igual a vaga
// Anbas as listas devem gerar notificaçoes via email e push
// Onde a de email devem conter o link para a vaga e o push deve conter o nome da vaga
// Essa função deve ser executada de forma assincrona, pois pode demorar um pouco
// Ela vai receber a vaga que foi criada e vai notificar os candidatos
async function notificarCandidatos(vaga: any) {

    const candidatoRepository = AppDataSource.getRepository(Candidato);
    const candidatos = await candidatoRepository.find();


    try {


        let areaVaga = await AppDataSource.getRepository(Area).findOne({where: {idArea: vaga.idArea}});
        if (!areaVaga) return;

        // Vai executar uma query SQL para pegar os candidatos que tem todos os atributos iguais a vaga
        let candidatosAllMatch = await candidatoRepository.find({
            select: ['idCandidato', 'nome', 'email'],
            where: {
                pretensaoSalarial: Between(vaga.salario - 1000, vaga.salario + 1000),
                cnh: vaga.cnh,
                tipoVagaInteresse: Like('%' + vaga.tipo_vaga + '%'),
                modalidadeInteresse: Like('%' + vaga.modalidade + '%'),
                areas: Like('%' + areaVaga.nome + '%')

            }
        });

        // Vai remover os candidatos que tem regiao diferente da vaga
        candidatosAllMatch = candidatosAllMatch.filter(candidato => {
            if(candidato.regiaoInteresse){

                if(candidato.cepInteresse != null && candidato.ufInteresse != null && candidato.cidadeInteresse != null)
                      return  candidato.cepInteresse.includes(vaga.cep) || candidato.ufInteresse.includes(vaga.uf) || candidato.cidadeInteresse.includes(vaga.cidade);
            }

        });

        let candidatosOneMatch = await candidatoRepository.find({
            select: ['idCandidato', 'nome', 'email'],
            where: [
                {pretensaoSalarial: Between(vaga.salario - 1000, vaga.salario + 1000)},
                {cnh: vaga.cnh},
                {tipoVagaInteresse: Like('%' + vaga.tipo_vaga + '%')},
                {modalidadeInteresse: Like('%' + vaga.modalidade + '%')},
                {areas: Like('%' + areaVaga.nome + '%')}
            ]
        });

        const vagaToSend = {
            titulo_vaga: vaga.titulo_vaga,
            descricao: vaga.descricao,
            salario: vaga.salario,
            local: vaga.cidade + ' - ' + vaga.uf,
            maisInfo: vaga.tipo_vaga + ' - ' + vaga.modalidade + ' - ' + vaga.regime,
        }

        for (const candidato of candidatosAllMatch) {
             await sendEmailNotification(candidato, vagaToSend, '', "perfeita");
        }

        candidatosOneMatch = candidatosOneMatch.filter(candidato => !candidatosAllMatch.includes(candidato));

        for (const candidato of candidatosOneMatch) {
            await sendEmailNotification(candidato, vagaToSend, '', '');
        }

    } catch (error) {
        console.log(error);
    }

}



