import { Router } from "express";
import AdminController from "./controller/AdminController";
import CandidatoController from "./controller/CandidatoController";
import EmpresaController from "./controller/EmpresaController";
import ProfissionalLiberalController from "./controller/ProfissionalLiberalController";
import VagaController from "./controller/VagaController";
import AreaController from "./controller/AreaController";
import EquipeController from "./controller/EquipeController";
import AuthController from "./controller/AuthController";
import authentication from "./middleware/authentication";
import RepresentanteController from "./controller/RepresentanteController";
import CepController from "./controller/CepController";
import TipoServicoController from "./controller/TipoServicoController";
import multer from "multer";


const adminController = new AdminController();
const candidatoController = new CandidatoController();
const empresaController = new EmpresaController();
const equipeController = new EquipeController();
const profissionalLiberalController = new ProfissionalLiberalController();
const vagaController = new VagaController();
const areaController = new AreaController();
const tipoServicoController = new TipoServicoController();
const representanteController = new RepresentanteController();
const cepController = new CepController();

const routes = Router();

routes.post("/login-candidato", AuthController.loginCandidato);
routes.post("/login-profissional", AuthController.loginProfissional);
routes.post("/login-empresa", AuthController.loginEmpresa);
routes.post("/login-representante", AuthController.loginRepresentante);
routes.post("/login-admin", AuthController.loginAdminEquipe);
routes.post("/forgot-password", AuthController.forgotPassword);
routes.post("/check-user-google", AuthController.checkUserGoogle);

/* Administrador
*/
routes.post("/create-admin", authentication.validate, adminController.create);
routes.get("/list-admins", authentication.validate, adminController.index);
routes.put("/update-admin/:id", authentication.validate, adminController.update);
routes.get("/find-admin/:id", authentication.validate, adminController.find);
routes.delete("/delete-admin/:id", authentication.validate, adminController.delete);

/* Equipe 
*/
routes.post("/create-equipe", equipeController.create);
routes.get("/list-equipes", equipeController.index);
routes.put("/update-equipe/:id", equipeController.update);
routes.get("/find-equipe/:id", authentication.validate, equipeController.find);
routes.delete("/delete-equipe/:id", equipeController.delete);

/* Candidato
*/
routes.post("/create-candidato",multer().fields([{name: 'curriculo'},{name:'pcd'},{name:'candidato'}]), candidatoController.create);
routes.get("/list-candidatos",candidatoController.index);
routes.delete("/delete-candidato/:id",candidatoController.delete);
routes.put("/update-candidato/:id",multer().fields([{name: 'curriculo'},{name:'pcd'},{name:'candidato'}]),candidatoController.update);
routes.get("/find-candidato/:id",candidatoController.findById);

/* Profisional Liberal
*/
routes.post("/create-profissional",multer().single('file'),profissionalLiberalController.create);
routes.get("/list-profissionais",profissionalLiberalController.index);
routes.delete("/delete-profissional/:id", profissionalLiberalController.delete);
routes.put("/update-profissional/:id",multer().single('file'), profissionalLiberalController.update);
routes.get("/find-profissional/:id", profissionalLiberalController.findById);
routes.get("/find-file/:id", profissionalLiberalController.getFile);

/*Empresa
*/
routes.post("/create-empresa", empresaController.create);
routes.get("/list-empresas", empresaController.index);
routes.delete("/delete-empresa/:id", empresaController.delete);
routes.put("/update-empresa/:id",empresaController.update);
routes.get("/find-empresa/:id",empresaController.findById);

/* Vaga
*/
routes.post("/create-vaga", vagaController.create);
routes.get("/list-vagas", vagaController.indexTodas);
routes.get("/list-vagas-empresa/:id", vagaController.indexEmpresa);
routes.get("/list-vagas-equipe", vagaController.indexEquipe);
routes.delete("/delete-vaga-adm/:id", vagaController.deleteByADM);
routes.delete("/delete-vaga-equipe/:id", vagaController.deleteByEquipe);
routes.delete("/delete-vaga-representante/:id", vagaController.deleteByRepresentante);
//routes.put("/update-vaga/:id", authentication.validate,vagaController.update);
routes.get("/find-vaga/:id",vagaController.findById);
routes.put("/update-vaga", authentication.validate, vagaController.update);
routes.post("/canditar-vaga",vagaController.candidatar);

/* Area
*/
routes.post("/create-area",areaController.create);
routes.get("/list-areas", areaController.index);
routes.delete("/delete-area/:id", areaController.delete);
routes.put("/update-area/:id",areaController.update);
routes.get("/find-area/:id",areaController.findById);

/* Tipo Servico
 */
routes.post("/create-tipo-servico",tipoServicoController.create);
routes.get("/list-tipo-servicos", tipoServicoController.index);
routes.delete("/delete-tipo-servico/:id", tipoServicoController.delete);
routes.put("/update-tipo-servico/:id",tipoServicoController.update);

/* Representante
*/
routes.post("/create-representante",representanteController.create);
routes.get("/list-representantes",representanteController.index);
routes.delete("/delete-representante/:id", representanteController.delete);
routes.put("/update-representante/:id", representanteController.update);
routes.get("/find-representante/:id",representanteController.findById);

/* Cep

 */
routes.get("/find-cep/:cep", cepController.find);
routes.get("/list-ceps", cepController.index);

export default routes;
