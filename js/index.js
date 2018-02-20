(function ($) {

    var calculator = {

        defaultValue: 2000,
        values: {},

        fetchData: function () {
            var url = './options.json';

            $.get(url, function(data) {
                this.data = data;
                this.defaultValue = data.value;
                this.defaultValueInput.value = this.defaultValue;
                this.valueInput.value = this.defaultValue;

                this.createDefaultOptions(this.data.default, document.querySelector('#c-default'));
                this.createCustomOptions(this.data);
                this.initSelecticPlugin();
            }.bind(this));
        },

        initSelecticPlugin: function () {
            $('select').selectric({
                onChange: function(element) {
                    this.calculateValue(element.dataset.title, element.value, true);
                  }.bind(this),
            });
        },

        createDefaultOptions: function (data, parent) {
            var defaultOptions = document.createElement('ul');
            data.forEach(function(option) {
                let li = document.createElement('li');
                li.appendChild(document.createTextNode(option));
                defaultOptions.appendChild(li);
            });
            parent.appendChild(defaultOptions);
        },

        createCustomOptions: function (data) {
            for(var type in data.options) {
                for(var option in data.options[type]){
                    this.createOption(data.options[type][option], document.querySelector('#c-'+type));
                }
            }
        },

        createOption: function (data, parent) {
            var input,
                label = document.createElement('label'),
                optionContainer = document.createElement('div');

            optionContainer.classList.add('option');
            label.appendChild(document.createTextNode(data.title));

            if(data.type  === "select") {
                input = document.createElement('select');
                let option = document.createElement('option');
                option.value = 0;
                option.appendChild(document.createTextNode('Brak'));
                input.appendChild(option);
                data.list.forEach(function (el, index) {
                    let option = document.createElement('option');
                    option.value = data.price * (index +1);
                    option.appendChild(document.createTextNode(el));
                    input.appendChild(option);
                });
                input.dataset.title = data.title;

                optionContainer.appendChild(label);
                optionContainer.appendChild(input);
            } else {
                input = document.createElement('input');
                input.value = data.price;
                input.type = data.type;
                input.checked = data.checked;
                
                input.checked && this.calculateValue(data.title, input.value, true);

                input.addEventListener('click', function () {
                    this.calculateValue(data.title, input.value, input.checked);
                }.bind(this), false);
                
                label.classList.add('chackbox-label');
                label.appendChild(input);
                optionContainer.appendChild(label);
            }
            parent.appendChild(optionContainer);
        },

        calculateValue: function (title, value, add) {
            var newValue = this.defaultValue;
            this.values[title] = add ? parseInt(value) : 0;
            for(var i in this.values) {
                newValue += this.values[i];
            };
            this.valueInput.value = newValue;
        },

        init: function (defaultValueInput, valueInput) {
            this.defaultValueInput = defaultValueInput;
            this.valueInput = valueInput;
            this.fetchData();
        }
    };

    $(function() {
        calculator.init(document.querySelector('#c-value-default'), document.querySelector('#c-value'));
    })

})(jQuery);