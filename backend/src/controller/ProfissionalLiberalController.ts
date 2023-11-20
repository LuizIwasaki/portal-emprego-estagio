import {Request, Response} from "express";
import {AppDataSource} from "../database/data-source";
import {hash} from "bcrypt";
import * as bcrypt from "bcrypt";
import {TipoUsuario} from "../../../shared/enums/TipoUsuario";
import {ProfissionalLiberal} from "../database/models/ProfissionalLiberal";
import {Contato} from "../database/models/Contato";
import {TipoServico} from "../database/models/TipoServico";
import {Not} from "typeorm";

export default class ProfissionalLiberalController extends ProfissionalLiberal {


    constructor() {
        super();
    }

    // Create
    async create(request: Request, response: Response) {
        try {
            let file = request.file;

            // Transforma o body em um objeto
            let profissionalBody = JSON.parse(request.body.profissional);
            if (!profissionalBody) return response.status(400).json({message: "Profissional não informado"});

            const profissionalRepository = AppDataSource.getRepository(ProfissionalLiberal);
            const contatoRepository = AppDataSource.getRepository(Contato);
            const tipoServicoRepository = AppDataSource.getRepository(TipoServico);


            const profissionalExists = await profissionalRepository.findOneBy({email: profissionalBody.email});
            if (profissionalExists) {
                return response.status(400).json({message: "Profissional com este email já cadastrado"});
            }
            const passHash = await hash(profissionalBody.senha, 8)

            let servicos: TipoServico[] = [];

            for (let tipo of profissionalBody.tipoServicos) {
                let servico;
                if (tipo.name !== undefined){
                    servico = await tipoServicoRepository.findOne({where: {nome: tipo.name}});

                }else
                    servico = await tipoServicoRepository.findOne({where: {nome: tipo}});

                if (!servico) {
                    servico = new TipoServico();
                    if (tipo.name !== undefined) servico.nome = tipo.name;
                    else servico.nome = tipo;
                    servico = await tipoServicoRepository.save(servico);
                }
                servicos.push(servico);
            }


            let profissionalCreate = new ProfissionalLiberal();

            profissionalCreate.nome = profissionalBody.nome;
            profissionalCreate.email = profissionalBody.email;
            profissionalCreate.senha = passHash;
            profissionalCreate.cep = +profissionalBody.cep;
            profissionalCreate.logradouro = profissionalBody.lograduro;
            profissionalCreate.numero = profissionalBody.numero;
            profissionalCreate.complemento = profissionalBody.complemento;
            profissionalCreate.cidade = profissionalBody.cidade;
            profissionalCreate.uf = profissionalBody.uf;
            profissionalCreate.complemento = profissionalBody.complemento;
            profissionalCreate.descricao = profissionalBody.descricao;
            profissionalCreate.tipoServicos = servicos;
            profissionalCreate.tipo = "ProfissionalLiberal";

            // Se o arquivo for PDF é salvo no arquviPDF
            if (file) {
                if (file.mimetype === "application/pdf") {
                    profissionalCreate.arquivoPdf = file.buffer;
                } else {
                    profissionalCreate.arquivoImagem = file.buffer;
                }
            }

            const profissional = profissionalRepository.create(profissionalCreate);
            profissional.tipoServicos = servicos;
            await profissionalRepository.save(profissional);

            // Agora, adicione os contatos
            for (const contatoData of profissionalBody.contatos) {
                const {contato, tipoContato} = contatoData;
                const contatoEntity = contatoRepository.create({
                    contato,
                    tipoContato,
                    idProfissionalLiberal2: profissional,
                });
                await contatoRepository.save(contatoEntity);
            }

            return response.status(200).json({message: "Profissional cadastrado com sucesso"});
        } catch (error) {
            console.log(error)
            return response.status(500).json({message: "Erro ao cadastrar profissional", error: error});
        }
    }


    // Read
    async index(request: Request, response: Response) {
        try {


            const profissionalRepository = AppDataSource.getRepository(ProfissionalLiberal);

            const tipoServicoRepository = AppDataSource.getRepository(TipoServico);

            const profissionais = await profissionalRepository.find({relations: ["tipoServicos", "contatos"]});

            return response.status(200).json(profissionais);
        } catch (error) {
            console.log(error)
            return response.status(500).json({message: "Erro ao listar profissionais", error: error});
        }
    }

    async findById(request: Request, response: Response) {
        try {


            const {id} = request.params;
            if (!id) return response.status(400).json({message: "Id não informado"});
            if (isNaN(+id)) return response.status(400).json({message: "Id deve ser um número"});
            const profissionalRepository = AppDataSource.getRepository(ProfissionalLiberal);
            const profissional = await profissionalRepository
                .findOne(
                    {
                        where: {idProfissionalLiberal: +id},
                        relations: ["tipoServicos", "contatos"]
                    });
            if (!profissional) {
                return response.status(404).json({message: "Profissional não encontrado"});
            }
            return response.status(200).json(profissional);
        } catch (error) {
            console.log(error)
            return response.status(500).json({message: "Erro ao listar profissional", error: error});
        }
    }

    async getFile(request: Request, response: Response) {
        try {


            const {id} = request.params;
            if (!id) return response.status(400).json({message: "Id não informado"});
            if (isNaN(+id)) return response.status(400).json({message: "Id deve ser um número"});
            const profissionalRepository = AppDataSource.getRepository(ProfissionalLiberal);
            const profissional = await profissionalRepository
                .findOne(
                    {
                        where: {idProfissionalLiberal: +id},
                    });
            if (!profissional) {
                return response.status(404).json({message: "Profissional não encontrado"});
            }
            if (profissional.arquivoPdf) {
                const mimeType = "application/pdf";

                const base64 = profissional.arquivoPdf.toString('base64');


                // Retornando o arquivo e informando o tipo
                return response.status(201).type(mimeType).send(base64);
            } else if (profissional.arquivoImagem) {

                const mimeType = "image/jpeg";

                const base64 = profissional.arquivoImagem.toString('base64');


                return response.status(200).type(mimeType).send(base64);

            } else {
                return response.status(404).json({message: "Arquivo não encontrado"});
            }
        } catch (error) {
            console.log(error)
            return response.status(500).json({message: "Erro ao listar profissional", error: error});
        }
    }

    async findByEmail(request: Request, response: Response) {
        try {


            const {email} = request.params;
            if (!email) return response.status(400).json({message: "Email não informado"});
            const profissionalRepository = AppDataSource.getRepository(ProfissionalLiberal);
            const profissional = await profissionalRepository
                .findOne(
                    {
                        where: {email: email},
                        relations: ["tipoServicos", "contatoes"]
                    });
            if (!profissional) {
                return response.status(404).json({message: "Profissional não encontrado"});
            }
            return response.status(200).json(profissional);
        } catch (error) {
            console.log(error)
            return response.status(500).json({message: "Erro ao listar profissional", error: error});
        }
    }


    // Update
    async update(request: Request, response: Response) {

        try {


            const file = request.file;


            const profissionalBody = JSON.parse(request.body.profissional);
            if (!profissionalBody) return response.status(400).json({message: "Profissional não informado"});

            const {id} = request.params;
            if (!id) return response.status(400).json({message: "Id não informado"});
            if (isNaN(+id)) return response.status(400).json({message: "Id deve ser um número"});
            const tipoServicoRepository = AppDataSource.getRepository(TipoServico);
            const profissionalRepository = AppDataSource.getRepository(ProfissionalLiberal);
            const profissionalExists = await profissionalRepository.findOneBy({idProfissionalLiberal: +id});
            if (!profissionalExists) {
                return response.status(404).json({message: "Profissional não encontrado"});
            }

            if (profissionalBody.nome !== profissionalExists.nome) profissionalExists.nome = profissionalBody.nome;
            if (profissionalBody.email !== profissionalExists.email) profissionalExists.email = profissionalBody.email;
            if (profissionalBody.cep !== profissionalExists.cep) profissionalExists.cep = profissionalBody.cep;
            if (profissionalBody.logradouro !== profissionalExists.logradouro) profissionalExists.logradouro = profissionalBody.logradouro;
            if (profissionalBody.numero !== profissionalExists.numero) profissionalExists.numero = profissionalBody.numero;
            if (profissionalBody.complemento !== profissionalExists.complemento) profissionalExists.complemento = profissionalBody.complemento;
            if (profissionalBody.cidade !== profissionalExists.cidade) profissionalExists.cidade = profissionalBody.cidade;
            if (profissionalBody.uf !== profissionalExists.uf) profissionalExists.uf = profissionalBody.uf;
            if (profissionalBody.descricao !== profissionalExists.descricao) profissionalExists.descricao = profissionalBody.descricao;
            if (profissionalBody.tipo !== profissionalExists.tipo) profissionalExists.tipo = profissionalBody.tipo;
            if (profissionalBody.contatos !== profissionalExists.contatos) profissionalExists.contatos = profissionalBody.contatos;

            if (file) {
                if (file.mimetype === "application/pdf") {
                    profissionalExists.arquivoPdf = file.buffer;
                    profissionalExists.arquivoImagem = null;
                } else {
                    profissionalExists.arquivoImagem = file.buffer;
                    profissionalExists.arquivoPdf = null;
                }
            }

            const profissionalEmailExists = await profissionalRepository.findOne({
                where: {
                    email: profissionalBody.email,
                    idProfissionalLiberal: Not(profissionalExists.idProfissionalLiberal)
                }
            });

            if (profissionalEmailExists) {
                return response.status(400).json({message: "Email já cadastrado por outro profissional"});
            }

            if (profissionalBody.tipoServicos !== profissionalExists.tipoServicos) {

                let servicos: TipoServico[] = [];

                for (let tipo of profissionalBody.tipoServicos) {
                    let servico = await tipoServicoRepository.findOne({where: {nome: tipo}});
                    if (!servico) {
                        servico = new TipoServico();
                        servico.nome = tipo.nome;
                        servico = await tipoServicoRepository.save(servico);
                    }
                    servicos.push(servico);
                }
                profissionalExists.tipoServicos = servicos;
            }
            const profissional = profissionalRepository.create(profissionalExists);
            await profissionalRepository.save(profissional);

            const contatoRepository = AppDataSource.getRepository(Contato);


            // Pegar todos os contados do profissional
            const contatos = await contatoRepository.findBy({idProfissionalLiberal: +profissionalExists.idProfissionalLiberal});

            // Deletar os contatos que não estão no body
            for (const contato of contatos) {
                let contatoExiste = null;
                contatoExiste = profissionalBody.contatoes.filter((contatoBody: any) => contatoBody.idContato === contato.idContato);
                if (contatoExiste === null || contatoExiste.length === 0) {
                    await contatoRepository.delete(contato.idContato);

                }
            }

            // Adicionar os novos contatos
            for (const contatoData of profissionalBody.contatoes) {
                const {contato, tipoContato} = contatoData;
                if (contatoData.idContato === null || contatoData.idContato === undefined) {
                    const contatoEntity = contatoRepository.create({
                        contato,
                        tipoContato,
                        idProfissionalLiberal2: profissionalExists,
                    });
                    await contatoRepository.save(contatoEntity);
                }
            }

            return response.status(201).json(profissional);
        } catch (error) {
            console.log(error)
            return response.status(500).json({message: "Erro ao atualizar profissional", error: error});
        }
    }

    // Delete
    async delete(request: Request, response: Response) {
        try {


            const {email} = request.body;
            if (!email) return response.status(400).json({message: "Email não informado"});
            const profissionalRepository = AppDataSource.getRepository(ProfissionalLiberal);
            const profissional = await profissionalRepository.findOneBy({email: email});
            if (!profissional) {
                return response.status(404).json({message: "Profissional não encontrado"});
            }
            profissional.deletedAt = new Date(Date.now());
            await profissionalRepository.softRemove(profissional);
            return response.status(200).json(profissional);
        } catch (error) {
            console.error(error)
            return response.status(500).json({message: "Erro ao deletar profissional", error: error});
        }
    }
}