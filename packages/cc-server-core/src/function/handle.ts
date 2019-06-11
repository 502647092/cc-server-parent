import {
    controller, response, requestBody, httpGet, httpPost, queryParam, requestParam
} from 'inversify-express-utils';
import { inject, postConstruct } from 'inversify';
import { DBClient } from 'cc-server-db'
import 'cc-server-db-mongo'

//process.env.FAAS_MONGO_URL = 'mongodb://192.168.0.2:27017';
//process.env.FAAS_MONGO_DB = "faas";

const TABLE = 'users'

interface ExampleModel {
    _id: string;
    username: string;
    password: string;
    age: number;
    email: string;
}

type Model = ExampleModel

@controller('')
export class Controller {
    @inject(DBClient)
    private client: DBClient

    @postConstruct()
    private init(): void {
        this.client.setTable(TABLE);
    }

    @httpGet('/')
    public async list(): Promise<Model[]> {
        return this.client.find({});
    }

    @httpGet('/:id')
    public async get(
        @requestParam('id') id: string
    ): Promise<Model> {
        return this.client.findOneById(id);
    }

    @httpPost('/')
    public async create(
        @requestBody() model: Model
    ): Promise<Model> {
        return this.client.insertOne(model);
    }

    @httpPost('/:id')
    public async update(
        @requestParam('id') id: string,
        @requestBody() model: Model
    ): Promise<boolean> {
        return this.client.updateById(id, model);
    }
}
