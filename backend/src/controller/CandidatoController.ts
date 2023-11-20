import {Request, Response} from "express";
import {AppDataSource} from "../database/data-source";
import {hash} from "bcrypt";
import {TipoUsuario} from "../../../shared/enums/TipoUsuario";
import {Candidato} from "../database/models/Candidato";
import {Column, OneToMany} from "typeorm";
import {Contato} from "../database/models/Contato";
import {Area} from "../database/models/Area";

export default class CandidatoController extends Candidato {

    constructor() {
        super();
    }

    async create(request: Request, response: Response) {
        const files = request.files;
        try {
            if (!files) {
                return response.status(400).json({message: "Arquivos não enviados"});
            }

            /// PODE DAR ERRO AQUI
            // @ts-ignore
            const fileCurriculo = files.curriculo;
            // @ts-ignore
            const filePcd = files.pcd;
            // Pega o candidato que esta no body da requisição
            let body = JSON.parse(request.body.candidato);
            if (body===undefined || !body) {

                return response.status(400).json({message: "Candidato não enviado"});
            }

            const candidatoRepository = AppDataSource.getRepository(Candidato);
            const contatoRepository = AppDataSource.getRepository(Contato);

            // Find by email ou cpf
            const candidatoEmailExists = await candidatoRepository.findOne({where: {email: body.email}});

            if (candidatoEmailExists) {
                return response.status(400).json({message: "Candidato com este email já cadastrado"});
            }

            const candidatoCpfExists = await candidatoRepository.findOne({where: {cpf: body.cpf}});
            if (candidatoCpfExists) {
                return response.status(400).json({message: "Candidato com este cpf já cadastrado"});
            }
            const passHash = await hash(body.senha, 8)


            let candidatoCreate = new Candidato();

            candidatoCreate.nome = body.nome;
            candidatoCreate.nomeSocial = body.nomeSocial;
            candidatoCreate.genero = body.genero;
            candidatoCreate.cpf = body.cpf;
            candidatoCreate.email = body.email;
            candidatoCreate.senha = passHash;
            candidatoCreate.tipo = body.tipo;
            candidatoCreate.pretensaoSalarial = body.pretensaoSalarial;
            candidatoCreate.cep = body.cep;
            candidatoCreate.cidade = body.cidade;
            candidatoCreate.logradouro = body.logradouro;
            candidatoCreate.numero = body.numero;
            candidatoCreate.complemento = body.complemento;
            candidatoCreate.uf = body.uf;
            candidatoCreate.disponibilidade = body.disponibilidade;
            candidatoCreate.cnh = body.cnh;
            candidatoCreate.nivelInstrucao = body.nivelInstrucao;
            candidatoCreate.dataNascimento = body.dataNascimento;
            candidatoCreate.regiaoInteresse = body.regiaoInteresse;
            candidatoCreate.cepInteresse = body.cepInteresse;
            candidatoCreate.cidadeInteresse = body.cidadeInteresse;
            candidatoCreate.ufInteresse = body.ufInteresse;
            candidatoCreate.regimeInteresse = body.regimeInteresse;
            candidatoCreate.tipoVagaInteresse = body.tipoVagaInteresse;
            candidatoCreate.modalidadeInteresse = body.modalidadeInteresse;
            candidatoCreate.areas = body.areas;
            candidatoCreate.contatos = body.contatos;
            if (fileCurriculo) candidatoCreate.curriculo = fileCurriculo[0].buffer;
            if (filePcd) candidatoCreate.pcd = filePcd[0].buffer;

            const candidato = candidatoRepository.create(candidatoCreate);
            await candidatoRepository.save(candidato);

            for (const contatoData of body.contatos) {
                const {contato, tipoContato} = contatoData;
                const contatoEntity = contatoRepository.create({
                    contato,
                    tipoContato,
                    idCandidato2: candidato,
                });

                await contatoRepository.save(contatoEntity);
            }

            return response.status(201).json(candidato);
        } catch (error) {
            console.log(error)
            return response.status(500).json({message: "Erro interno no servidor"});
        }
    }

    async index(request: Request, response: Response) {
        try {
            const candidatoRepository = AppDataSource.getRepository(Candidato);
            const contatoRepository = AppDataSource.getRepository(Contato);


            const candidatos = await candidatoRepository.find();
            const contatos = await contatoRepository.find();

            for (let i = 0; i < candidatos.length; i++) {
                const candidato = candidatos[i];
                let contatosCandidato = [];
                for (let j = 0; j < contatos.length; j++) {
                    const contato = contatos[j];
                    if (contato.idCandidato === candidato.idCandidato) {
                        contatosCandidato.push(contato);
                    }
                }
                candidato.contatos = contatosCandidato;
            }
            return response.status(200).json(candidatos);
        } catch (error) {
            console.log(error)
            return response.status(500).json({message: "Erro interno no servidor"});
        }
    }

    async findById(request: Request, response: Response) {
        try {


            const {id} = request.params;
            if (!id) {
                return response.status(400).json({message: "Id não enviado"});
            }
            const candidatoRepository = AppDataSource.getRepository(Candidato);
            const contatoRepository = AppDataSource.getRepository(Contato);
            const candidato = await candidatoRepository.findOne({
                where: {
                    idCandidato: +id
                },
                relations: ["contatos"]
            });
            if (!candidato) {
                return response.status(404).json({message: "Candidato não encontrado"});
            }


            return response.status(200).json(candidato);
        } catch (error) {
            console.log(error)
            return response.status(500).json({message: "Erro interno no servidor"});
        }
    }

    async findByEmail(request: Request, response: Response) {
        try {


            const {email} = request.params;
            const candidatoRepository = AppDataSource.getRepository(Candidato);
            const candidato = await candidatoRepository.findOneBy({email: email});
            if (!candidato) {
                return response.status(404).json({message: "Candidato não encontrado"});
            }
            return response.status(200).json(candidato);
        } catch (error) {
            console.log(error)
            return response.status(500).json({message: "Erro interno no servidor"});
        }
    }

    async update(request: Request, response: Response) {

            const {id} = request.params;
            const files = request.files;

            if (!files) {
                return response.status(400).json({message: "Arquivos não enviados"});
            }

            /// PODE DAR ERRO AQUI
            // @ts-ignore
            const fileCurriculo = files.curriculo;
            // @ts-ignore
            const filePcd = files.pcd;

            // Pega o candidato que esta no body da requisição
            let body = JSON.parse(request.body.candidato);

        try {

            const candidatoRepository = AppDataSource.getRepository(Candidato);
            const contatoRepository = AppDataSource.getRepository(Contato);

            const candidatoExists = await candidatoRepository.findOneBy({idCandidato: +id});

            if (!candidatoExists) {
                return response.status(404).json({message: "Candidato não encontrado"});
            }


            if (body.nome !== candidatoExists.nome) candidatoExists.nome = body.nome;
            if (body.nomeSocial !== candidatoExists.nomeSocial) candidatoExists.nomeSocial = body.nomeSocial;
            if (body.genero !== candidatoExists.genero) candidatoExists.genero = body.genero;
            if (body.cpf !== candidatoExists.cpf) candidatoExists.cpf = body.cpf;
            if (body.email !== candidatoExists.email) candidatoExists.email = body.email;
            if (body.tipo !== candidatoExists.tipo) candidatoExists.tipo = body.tipo;
            if (body.pretensaoSalarial !== candidatoExists.pretensaoSalarial) candidatoExists.pretensaoSalarial = body.pretensaoSalarial;
            if (body.cep !== candidatoExists.cep) candidatoExists.cep = body.cep;
            if (body.cidade !== candidatoExists.cidade) candidatoExists.cidade = body.cidade;
            if (body.logradouro !== candidatoExists.logradouro) candidatoExists.logradouro = body.logradouro;
            if (body.numero !== candidatoExists.numero) candidatoExists.numero = body.numero;
            if (body.complemento !== candidatoExists.complemento) candidatoExists.complemento = body.complemento;
            if (body.uf !== candidatoExists.uf) candidatoExists.uf = body.uf;
            if (body.disponibilidade !== candidatoExists.disponibilidade) candidatoExists.disponibilidade = body.disponibilidade;
            if (body.cnh !== candidatoExists.cnh) candidatoExists.cnh = body.cnh;
            if (body.nivelInstrucao !== candidatoExists.nivelInstrucao) candidatoExists.nivelInstrucao = body.nivelInstrucao;
            if (body.dataNascimento !== candidatoExists.dataNascimento) candidatoExists.dataNascimento = body.dataNascimento;
            if (body.regiaoInteresse !== candidatoExists.regiaoInteresse) candidatoExists.regiaoInteresse = body.regiaoInteresse;
            if (body.cepInteresse !== candidatoExists.cepInteresse) candidatoExists.cepInteresse = body.cepInteresse;
            if (body.cidadeInteresse !== candidatoExists.cidadeInteresse) candidatoExists.cidadeInteresse = body.cidadeInteresse;
            if (body.ufInteresse !== candidatoExists.ufInteresse) candidatoExists.ufInteresse = body.ufInteresse;
            if (body.regimeInteresse !== candidatoExists.regimeInteresse) candidatoExists.regimeInteresse = body.regimeInteresse;
            if (body.tipoVagaInteresse !== candidatoExists.tipoVagaInteresse) candidatoExists.tipoVagaInteresse = body.tipoVagaInteresse;
            if (body.modalidadeInteresse !== candidatoExists.modalidadeInteresse) candidatoExists.modalidadeInteresse = body.modalidadeInteresse;
            if (body.areas !== candidatoExists.areas) candidatoExists.areas = body.areas;
            if (body.contatos !== candidatoExists.contatos) candidatoExists.contatos = body.contatos;
            if (fileCurriculo) candidatoExists.curriculo = fileCurriculo[0].buffer;
            if (filePcd) candidatoExists.pcd = filePcd[0].buffer;



            const candidato = candidatoRepository.create(candidatoExists);
            await candidatoRepository.save(candidato);



            // Pegar todos os contados do candidato
            const contatos = await contatoRepository.findBy({idCandidato: +candidatoExists.idCandidato});


            // Deletar os contatos que não estão no body
            for (const contato of contatos) {
                let contatoExiste = null;
                contatoExiste = body.contatos.filter((contatoBody: any) => contatoBody.idContato === contato.idContato);
                if (contatoExiste === null || contatoExiste.length === 0) {
                    await contatoRepository.delete(contato.idContato);

                }
            }

            // Adicionar os novos contatos
            for (const contatoData of body.contatos) {
                const {contato, tipoContato} = contatoData;
                const contatoEntity = contatoRepository.create({
                    contato,
                    tipoContato,
                    idCandidato2: candidato,
                });

                await contatoRepository.save(contatoEntity);
            }
            return response.status(200).json(candidatoExists);
        } catch (error) {
            console.log(error)
            return response.status(500).json({message: "Erro interno no servidor"});
        }

    }

    async delete(request: Request, response: Response) {
        try {
            const {id} = request.params;
            const candidatoRepository = AppDataSource.getRepository(Candidato);
            const candidato = await candidatoRepository.findOneBy(
                {idCandidato: +id}
            );
            if (!candidato) {
                return response.status(404).json({message: "Candidato não encontrado"});
            }

            await candidatoRepository.softRemove(candidato);
            return response.status(200).json({message: "Candidato deletado com sucesso"});
        } catch (error) {
            console.log(error)
            return response.status(500).json({message: "Erro interno no servidor"});
        }
    }


}