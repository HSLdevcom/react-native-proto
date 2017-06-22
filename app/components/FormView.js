/**
 * FormView component
 * based on https://raw.githubusercontent.com/esbenp/react-native-clean-form/master/example/src/Form.js
 * @flow
 */

import React, {Component} from 'react';
import {Platform, Text, View} from 'react-native';
import {reduxForm} from 'redux-form/immutable';
import {
    ActionsContainer,
    Button,
    FieldsContainer,
    Fieldset,
    Form,
} from 'react-native-clean-form';
import {Input, Select} from 'react-native-clean-form/redux-form-immutable';

const onSubmit = values =>
    new Promise((resolve) => {
        setTimeout(() => {
            console.log(values.toJS());
            resolve();
        }, 1500);
    });

const typeOptions = [
    {
        label: 'Kiitos',
        value: 'kiitos',
    }, {
        label: 'Idea',
        value: 'idea',
    }, {
        label: 'Moite',
        value: 'moite',
    }, {
        label: 'Vikailmoitus',
        value: 'vikailmoitus',
    },
];
const whatOptions = [
    {
        label: 'Kuljettaja',
        value: 'kuljettaja',
    }, {
        label: 'Mukavuus',
        value: 'mukavuus',
    }, {
        label: 'Turvallisuus',
        value: 'turvallisuus',
    }, {
        label: 'Sujuvuus',
        value: 'sujuvuus',
    }, {
        label: 'Tiedotus',
        value: 'tiedotus',
    }, {
        label: 'Muu',
        value: 'muu',
    },
];
const lineOptions = [
    {
        label: '1',
        value: '1',
    },
    {
        label: '1A',
        value: '1A',
    },
    {
        label: '2',
        value: '2',
    },
    {
        label: '3',
        value: '3',
    },
];

class FormView extends Component { // eslint-disable-line react/prefer-stateless-function
    render() {
        const {handleSubmit, submitting} = this.props;

        return (
            <View
                style={{
                    flex: 1,
                    marginTop: (Platform.OS === 'ios') ? 63 : 53,
                    paddingBottom: 50,
                    width: '100%',
                }}
            >
                <View style={{paddingLeft: 10, paddingRight: 10}}>
                    <Text style={{fontSize: 12, marginTop: 15}}>
                        Anna palautetta tästä matkasta.
                        Valitse palautteen tyyppi, asia ja tarkennus.
                        Tämän jälkeen voit kuvata asiaa tekstimuotoisesti ja ottaa jopa kuvan.
                    </Text>
                    <Text style={{fontSize: 12, marginTop: 15}}>
                        Pikapalaute on testikäytössä.
                        Huomaathan, että palautteeseen ei ole mahdollista saada vastausta.
                    </Text>
                    <Text style={{fontSize: 12, marginTop: 15}}>
                        Tiedot ovat julkisia: ethän kirjoita yhteystietojasi.
                    </Text>
                </View>
                <Form>
                    <FieldsContainer>
                        <Fieldset label=" " last>
                            <Select name="type" label="Tyyppi" options={typeOptions} placeholder="" />
                            <Select name="what" label="Asia" options={whatOptions} placeholder="" />
                            <Input name="message" label="Kuvaus" placeholder="" multiline numberOfLines={5} inlineLabel={false} />
                            <Select name="line" label="Linja" options={lineOptions} placeholder="" />
                        </Fieldset>
                    </FieldsContainer>
                    <ActionsContainer>
                        <Button icon="md-checkmark" iconPlacement="right" onPress={handleSubmit(onSubmit)} submitting={submitting}>Lähetä</Button>
                    </ActionsContainer>
                </Form>
            </View>
        );
    }
}

FormView.propTypes = {
    handleSubmit: React.PropTypes.func.isRequired,
    submitting: React.PropTypes.bool.isRequired,
};

export default reduxForm({
    form: 'Form',
    validate: (values) => {
        const errors = {};

        const validateValues = values.toJS();
        console.log('validateValues: ', validateValues);

        if (!validateValues.first_name) {
            errors.first_name = 'First name is required.';
        }

        if (!validateValues.last_name) {
            errors.last_name = 'Last name is required.';
        }

        if (!validateValues.email) {
            errors.email = 'Email is required.';
        }

        return errors;
    },
})(FormView);
