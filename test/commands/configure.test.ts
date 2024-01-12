import {expect, test} from '@oclif/test'
import {confirm, input} from '@inquirer/prompts';
import {render} from "@inquirer/testing";
import {CLIError} from "@oclif/core/lib/errors";

describe('configure', () => {

    describe('configure interative', async () => {

        beforeEach(async () => {
            const {answer, events, getScreen} = await render(confirm, {
                message: 'Do you want to edit an existing AddOn?',
            });
            events.type('n');
            events.keypress('enter');
        });

        test
            .skip() // TODO: test interactive prompts
            .command(['configure'])
            // .stub(confirm, 'confirm', (q) => q.resolves(Promise.resolve('n')).returns('n'))
            // .stub(input, 'input', (q) => q.returns('name'))
            // .stub(input, 'input', (q) => q.returns('version'))
            // .stub(input, 'input', (q) => q.returns('namespace'))
            // .stub(input, 'input', (q) => q.returns('012345678901'))
            // .stub(input, 'input', (q) => q.returns('region'))
            .stdout()
            .it('prompts for the inputs', ctx => {
                expect(ctx.stdout).to.contain('hello world')
            });
    })

    describe('configure --addonName addonname', () => {
        test
            .stderr()
            .command(['configure', '--addonName', 'addonname'])
            .catch(ctx => {
                expect(ctx.message).to.eq('Error configuring addonname')
                if( ctx instanceof CLIError)
                    expect(ctx.oclif.exit).to.eq(1)

            })
            .it('Fails due to not enough parameters')
    });

    describe('configure with all valid parameters', () => {
        test
            .stdout()
            .command(['configure',
                    '--addonName', 'addonNameTest',
                    '--addonVersion', '0.1.0',
                    '--helmUrl', 'oci://012345678901.dkr.ecr.eu-west-1.amazonaws.com/addon-test',
                    '--marketplaceId', '012345678901',
                    '--namespace', 'addons-test',
                    '--region', 'eu-west-1',
                ]
            ).it('configure --... (all required parameters)', ctx => {
            expect(ctx.stdout).to.eq('Configured addonNameTest@0.1.0\n')
        })
    })
})
