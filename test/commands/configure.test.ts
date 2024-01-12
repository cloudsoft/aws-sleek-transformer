import {expect, test} from '@oclif/test'

describe('configure', () => {
    describe('configure', () => {
        test.stdout()
            .command(['configure'])
            .it('prompts for the inputs', ctx => {
                expect(ctx.stdout).to.contain('hello world')
            });

        describe('configure --addonName jeff', () => {
            test
                .stderr()
                .command(['configure', '--addonName', 'jeff'])
                .it('Fails due to not enough parameters', ctx => {
                    expect(ctx.stderr).to.contain('jeff')
                })
        });

        describe('configure with all valid parameters', () => {
            test
                .stdout()
                .command(['configure',
                        '--addonName', 'cloudsoftJuanTest',
                        '--addonVersion', '0.1.6',
                        '--helmUrl', 'oci://304295633295.dkr.ecr.eu-west-1.amazonaws.com/cloudsoft-amp-helm',
                        '--marketplaceId', '304295633295',
                        '--namespace', 'cloudsoft-amp',
                        '--region', 'eu-west',
                    ]
                ).it('configure --... (all required parameters)', ctx => {
                expect(ctx.stdout).to.eq('Configured cloudsoftJuanTest@0.1.6\n')
            })
        })
    })
})
