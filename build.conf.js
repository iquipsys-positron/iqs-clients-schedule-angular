module.exports = {
    module: {
        name: 'iqsPositronSchedule',
        styles: 'index',
        export: 'iqs.positron.schedule',
        standalone: 'iqs.positron.schedule'
    },
    build: {
        js: false,
        ts: false,
        tsd: true,
        bundle: true,
        html: true,
        sass: true,
        lib: true,
        images: true,
        dist: true
    },
    file: {
        lib: [
            '../node_modules/pip-webui-all/dist/**/*',
            '../node_modules/pip-suite-all/dist/**/*',
            '../node_modules/pip-admin-system/dist/**/*',
            '../iqs-libs-clientshell2-angular/dist/**/*',
            '../iqs-clients-unsupported-page/**/*'
        ]
    },
    samples: {
        port: 8197,
        https: false
    },
    api: {
        port: 8198
    },
    app: {
        publish: {
            alpha: {
                // bucket:  'tracker.pipdevs.com', 
                // accessKeyId: 'AKIAJ4VRA5Z2QYF5Q4AA',
                // secretAccessKey: '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',
                // region: 'us-east-1',
                // bucket:  'www.positron.iquipsys.net',
                bucket:  'www.positron.stage.iquipsys.net', 
                accessKeyId: 'AKIAILSKRJCVVHIO6HKA',
                secretAccessKey: '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',
                region: 'us-east-1'
            }
        },
        port: 8900,
        https: false
    }
};
