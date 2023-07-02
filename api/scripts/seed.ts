import db, { genId } from '../src/modules/common/prisma.module';

const main = async () => {
    await db.provider.createMany({
        data: [
            {
                id: genId(),
                name: 'Google',
                created_at: new Date(),
            },
            {
                id: genId(),
                name: 'apple',
                created_at: new Date(),
            },
        ],
    });
};

main()
    .catch((e) => {
        console.log(e);
    })
    .finally();
