import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200);
  });
});

describe('SLR sms use-case (e2e)', () => {
  let app: INestApplication;
  let configService: ConfigService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, ConfigModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    configService = moduleFixture.get(ConfigService);
  });

  jest.setTimeout(15000);
  it('should create entry in sms_track table on receive request in submission table', async () => {
    // Test entry creation
    const HASURA_URL = configService.get('HASURA_URL');
    const instanceId = randomUUID();

    const fetchStudentQuery = `query MyQuery {
      student(
        where: {
          is_enabled: {_eq: true}
          grade_number: {_eq: 2}
          section: {_eq: "A"}
          school: {
            is_active: {_eq: true}
            udise: {_eq: 111}
          }
        }
        limit: 1
      ) {
        id
      }
    }`;

    const respFetchQuery = await request(configService.get('GQL_URL'))
      .post('/')
      .set(JSON.parse(configService.get('GQL_HEADERS')))
      .send({ query: fetchStudentQuery })
      .expect(200);
    expect(respFetchQuery.body.data.student.length).toBe(1);

    const studentId = respFetchQuery.body.data.student[0].id;
    const xmlString = `<data><student>${studentId}</student><class/><session/><district/></data>`;
    const insertSubmissionQuery = `mutation MyQuery {
      insert_submission_one(object: {
        xml_string: "${xmlString}"
        type: "SLR"
        instance_id: "${instanceId}"
        user_id: ""
      }) {
        instance_id
        xml_string
      }
    }`;

    const respInsertQuery = await request(HASURA_URL)
      .post('/v1/graphql')
      .set('content-type', 'application/json')
      .set('x-hasura-admin-secret', configService.get('HASURA_ADMIN_SECRET'))
      .send({ query: insertSubmissionQuery });

    expect(respInsertQuery.statusCode).toEqual(200);
    expect(respInsertQuery.body.data.insert_submission_one).toEqual(
      expect.objectContaining({
        instance_id: instanceId,
        xml_string: xmlString,
      }),
    );

    // wait for 5sec
    await new Promise((r) => setTimeout(r, 5000));

    // test entry exist
    const checkSMSTrackQuery = `query MyQuery {
      sms_track(
        where: {
          instance_id: {_eq: "${instanceId}"}
        }
      ) {
        instance_id
      }
    }`;

    const respQuery = await request(HASURA_URL)
      .post('/v1/graphql')
      .set('content-type', 'application/json')
      .set('x-hasura-admin-secret', configService.get('HASURA_ADMIN_SECRET'))
      .send({ query: checkSMSTrackQuery });

    expect(respQuery.statusCode).toEqual(200);
    expect(respQuery.body.data.sms_track).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          instance_id: instanceId,
        }),
      ]),
    );

    // cleanup
    const deleteSubmissionQuery = `mutation MyQuery {
      delete_submission(where: {
        instance_id: {_eq: "${instanceId}"}
      }) {
        affected_rows
      }
    }`;

    await request(HASURA_URL)
      .post('/v1/graphql')
      .set('content-type', 'application/json')
      .set('x-hasura-admin-secret', configService.get('HASURA_ADMIN_SECRET'))
      .send({ query: deleteSubmissionQuery })
      .expect(200);

    const deleteSMSTrackQuery = `mutation MyQuery {
      delete_sms_track(where: {
        instance_id: {_eq: "${instanceId}"}
      }) {
        affected_rows
      }
    }`;

    await request(HASURA_URL)
      .post('/v1/graphql')
      .set('content-type', 'application/json')
      .set('x-hasura-admin-secret', configService.get('HASURA_ADMIN_SECRET'))
      .send({ query: deleteSMSTrackQuery })
      .expect(200);
  });
});
