import express from "express";
import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { hash } from "bcrypt";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generatePassword, sendEmail } from "./EmailController";
import admin from "firebase-admin";
import { TipoUsuario } from "../../../shared/enums/TipoUsuario";
import { Administrador } from "../database/models/Administrador";
import { Candidato } from "../database/models/Candidato";
import { Empresa } from "../database/models/Empresa";
import { Equipe } from "../database/models/Equipe";
import { ProfissionalLiberal } from "../database/models/ProfissionalLiberal";
import { DeepPartial } from "typeorm";
import { Representante } from "../database/models/Representante";

export default {

    async loginCandidato(request: Request, response: Response) {
        const { email, senha } = request.body;
        const candidatoRepository = AppDataSource.getRepository(Candidato);
        const candidato = await candidatoRepository.findOne({ where: { email } });
        
        if (candidato?.tipo === TipoUsuario.CANDIDATO) {
            if (await bcrypt.compare(senha, candidato.senha)) {
              
                const token = jwt.sign({ id: candidato.idCandidato }, process.env.ACCESS_TOKEN_SECRET as string, {
                    expiresIn: '5h',

                });
                return response.status(200).json({ message: "Login realizado com sucesso", id: candidato.idCandidato, tipo: candidato.tipo, token: token, usuario: candidato.nome });
                
            } else {
                return response.status(401).json({ message: "Senha incorreta" });
            }

        }
        
        
        return response.status(404).json({ message: "Usuário não encontrado" });
        
    },

    async loginProfissional(request: Request, response: Response) {
        const { email, senha } = request.body;

        const profissionalRepository = AppDataSource.getRepository(ProfissionalLiberal);        
        const profissional = await profissionalRepository.findOne({ where: { email } });
        
        if (profissional?.tipo === TipoUsuario.LIBERAL) {
            if (await bcrypt.compare(senha, profissional.senha)) {
                    
                    const token = jwt.sign({ id: profissional.idProfissionalLiberal }, process.env.ACCESS_TOKEN_SECRET as string, {
                        expiresIn: '1h',
    
                    });
                    return response.status(200).json({ message: "Login realizado com sucesso", id: profissional.idProfissionalLiberal, tipo: profissional.tipo, token: token });
                } else {
                    return response.status(401).json({ message: "Senha incorreta" });
            }
            
        }
        
        return response.status(404).json({ message: "Usuário não encontrado" });
        
    },

    async loginEmpresa(request: Request, response: Response) {
        const { email, senha } = request.body;

        const empresaRepository = AppDataSource.getRepository(Empresa);
        const representanteRepository = AppDataSource.getRepository(Representante);
        
        const empresa = await empresaRepository.findOne({ where: { email } });
        const representante = await representanteRepository.findOne({ where: { email } });

        if (empresa?.tipo === TipoUsuario.EMPRESA) {
            if (await bcrypt.compare(senha, empresa.senha)) {
                
                const token = jwt.sign({ id: empresa.idEmpresa }, process.env.ACCESS_TOKEN_SECRET as string, {
                    expiresIn: '1h',
                    
                });
                return response.status(200).json({ message: "Login realizado com sucesso", id: empresa.idEmpresa, tipo: empresa.tipo, token: token, usuario: empresa.nomeEmpresa });
                
            } else {
                return response.status(401).json({ message: "Senha incorreta" });
            }

        }

        if (representante?.tipo === TipoUsuario.REPRESENTANTE) {
            if (await bcrypt.compare(senha, representante.senha)) {
                
                const token = jwt.sign({ id: representante.idRepresentante }, process.env.ACCESS_TOKEN_SECRET as string, {
                    expiresIn: '1h',

                });
                return response.status(200).json({ message: "Login realizado com sucesso", id: representante.idRepresentante, tipo: representante.tipo, token: token, usuario: representante.nome });
                
            } else {
                return response.status(401).json({ message: "Senha incorreta" });
            }

        }
        
        return response.status(404).json({ message: "Usuário não encontrado" });
        
    },

    async loginRepresentante(request: Request, response: Response) {
        const { email, senha } = request.body;

        const representanteRepository = AppDataSource.getRepository(Representante);        
        const representante = await representanteRepository.findOne({ where: { email } });

        if (representante?.tipo === TipoUsuario.REPRESENTANTE) {
            if (await bcrypt.compare(senha, representante.senha)) {
                
                const token = jwt.sign({ id: representante.idRepresentante }, process.env.ACCESS_TOKEN_SECRET as string, {
                    expiresIn: '1h',

                });
                return response.status(200).json({ message: "Login realizado com sucesso", id: representante.idRepresentante, tipo: representante.tipo, token: token, usuario: representante.nome });
                
            } else {
                return response.status(401).json({ message: "Senha incorreta" });
            }

        }
        
        return response.status(404).json({ message: "Usuário não encontrado" });
        
    },
    
    
    async loginAdminEquipe(request: Request, response: Response) {
        const { email, senha } = request.body;
        const adminRepository = AppDataSource.getRepository(Administrador);
        const equipeRepository = AppDataSource.getRepository(Equipe);
        
        const admin = await adminRepository.findOne({ where: { email } });
        const equipe = await equipeRepository.findOne({ where: { email } });
        
        if (admin?.tipo === TipoUsuario.ADMINISTRADOR) {
            if (await bcrypt.compare(senha, admin.senha)) {
                
                const token = jwt.sign({ id: admin.idAdministrador }, process.env.ACCESS_TOKEN_SECRET as string, {
                    expiresIn: '1h',
                    
                });
                return response.status(200).json({ message: "Login realizado com sucesso", id: admin.idAdministrador, tipo: admin.tipo, token: token, usuario: admin.nome });
            } else {
                return response.status(401).json({ message: "Senha incorreta" });
            }

        }

        if (equipe?.tipo === TipoUsuario.EQUIPE) {
            if (await bcrypt.compare(senha, equipe.senha)) {
                
                const token = jwt.sign({ id: equipe.idEquipe }, process.env.ACCESS_TOKEN_SECRET as string, {
                    expiresIn: '1h',

                });
                return response.status(200).json({ message: "Login realizado com sucesso", id: equipe.idEquipe,  tipo: equipe.tipo, token: token, usuario: equipe.nome });

            } else {
                return response.status(401).json({ message: "Senha incorreta" });
            }

        }

        return response.status(404).json({ message: "Usuário não encontrado" });

    },

    async forgotPassword(request: Request, response: Response) {
        const { email } = request.body;

        const adminRepository = AppDataSource.getRepository(Administrador);
        const empresaRepository = AppDataSource.getRepository(Empresa);
        const profissionalRepository = AppDataSource.getRepository(ProfissionalLiberal);
        const equipeRepository = AppDataSource.getRepository(Equipe);
        const candidatoRepository = AppDataSource.getRepository(Candidato);

        const admin = await adminRepository.findOne({ where: { email } });
        const empresa = await empresaRepository.findOne({ where: { email } });
        const profissional = await profissionalRepository.findOne({ where: { email } });
        const equipe = await equipeRepository.findOne({ where: { email } });
        const candidato = await candidatoRepository.findOne({ where: { email } });

        if (admin) {
            const password = await generatePassword();
            const hashedPassword = await hash(password, 10);
            admin.senha = hashedPassword;
            await adminRepository.save(admin);
            await sendEmail(email, password);
            return response.status(200).json({ message: "Uma nova senha foi enviada para o seu email" });
        } else if (empresa) {
            const password = await generatePassword();
            const hashedPassword = await hash(password, 10);
            empresa.senha = hashedPassword;
            await empresaRepository.save(empresa);
            await sendEmail(email, password);
            return response.status(200).json({ message: "Uma nova senha foi enviada para o seu email" });
        } else if (profissional) {
            const password = await generatePassword();
            const hashedPassword = await hash(password, 10);
            profissional.senha = hashedPassword;
            await profissionalRepository.save(profissional);
            await sendEmail(email, password);
            return response.status(200).json({ message: "Uma nova senha foi enviada para o seu email" });
        } else if (equipe) {
            const password = await generatePassword();
            const hashedPassword = await hash(password, 10);
            equipe.senha = hashedPassword;
            await equipeRepository.save(equipe);
            await sendEmail(email, password);
            return response.status(200).json({ message: "Uma nova senha foi enviada para o seu email" });
        } else {
            return response.status(404).json({ message: "Usuário não encontrado" });
        }
    },

    async checkUserGoogle(request: Request, response: Response) {
        const { email } = request.body;

        const adminRepository = AppDataSource.getRepository(Administrador);

        const admin = await adminRepository.findOne({ where: { email } });

        if (admin) {
            const token = jwt.sign({ id: admin.idAdministrador }, process.env.ACCESS_TOKEN_SECRET as string, {
                expiresIn: '1h',

            });
            return response.status(200).json({ message: "Login realizado com sucesso", id: admin.idAdministrador, tipo: admin.tipo, token: token, usuario: admin.nome });
        } else {
            const password = await generatePassword();

            const hashedPassword = await hash(password, 10);

            const admin: DeepPartial<Administrador> = {
                nome: '',
                email,
                senha: hashedPassword,
                tipo: TipoUsuario.ADMINISTRADOR,
            };

            await adminRepository.save(admin);
        }

    }
    
}