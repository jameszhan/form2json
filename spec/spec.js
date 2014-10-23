// serializeJSON
describe("$.fn.serializeJSON", function () {
    var obj, $form;
    describe('checking my profile.', function () {
        beforeEach(function () {
            $form = $('<form>');
            $form.append($('<input type="text" name="fullName" value="James Zhan" />'));
            $form.append($('<input type="text" name="address[city]" value="Shenzhen" />'));
            $form.append($('<input type="text" name="address[state][name]" value="Guangdone" />'));
            $form.append($('<input type="text" name="address[state][abbr]"  value="CN" />'));
            $form.append($('<input type="text" name="hobbies[]" value="coding" />'));
            $form.append($('<input type="text" name="hobbies[]" value="reading" />'));
            $form.append($('<textarea name="projects[0][name]">form2json</textarea>'));
            $form.append($('<textarea name="projects[0][language]">javascript</textarea>'));
            $form.append($('<input type="checkbox" name="projects[0][popular]" checked />'));
            $form.append($('<textarea name="projects[1][name]">peony</textarea>'));
            $form.append($('<textarea name="projects[1][language]">ruby</textarea>'));
            $form.append($('<input type="checkbox" name="projects[1][popular]" />'));
        });

        it("serializes into plain attributes", function () {
            obj = $form.serializeJSON();
            expect(obj).toEqual({
                    fullName: "James Zhan",
                    address: {
                        city: "Shenzhen",
                        state: {
                            name: "Guangdone",
                            abbr: "CN"
                        }
                    },
                    hobbies: ["coding", "reading"],
                    projects: [
                        { name: "form2json", language: "javascript", popular: true },
                        { name: "peony", language: "ruby" }
                    ]
                }
            );
        });
    });

    it('accepts a jQuery object with a form', function () {
        $form = $('<form>');
        $form.append($('<input type="text" name="1" value="1"/>'));
        $form.append($('<input type="text" name="2" value="2"/>'));
        obj = $form.serializeJSON();
        expect(obj).toEqual({"1": "1", "2": "2"});
    });


    if ($.fn.jquery) {
        it('accepts a jQuery object with inputs', function () {
            $inputs = $('<input type="text" name="1" value="1"/>').add($('<input type="text" name="2" value="2"/>'));
            obj = $inputs.serializeJSON();
            expect(obj).toEqual({"1": "1", "2": "2"});
        });

        it('accepts a jQuery object with forms and inputs', function () {
            var $form1, $form2, $els;
            $form1 = $('<form>');
            $form1.append($('<input type="text" name="1" value="1"/>'));
            $form1.append($('<input type="text" name="2" value="2"/>'));
            $form2 = $('<form>');
            $form2.append($('<input type="text" name="3" value="3"/>'));
            $form2.append($('<input type="text" name="4" value="4"/>'));
            $inputs = $('<input type="text" name="5" value="5"/>').add($('<input type="text" name="6" value="6"/>'));
            $els = $form1.add($form2).add($inputs);
            obj = $els.serializeJSON();
            expect(obj).toEqual({"1": "1", "2": "2", "3": "3", "4": "4", "5": "5", "6": "6"});
        });
    }

    describe('with simple one-level attributes', function () {
        beforeEach(function () {
            $form = $('<form>');
            $form.append($("<input name='name' type='text' value='Bender' />"));
            $form.append($("<select name='hind'><option selected>Bitable</option><option>Kickable</option></select>"));
            $form.append($("<input type='checkbox' name='shiny' checked />"));
        });

        it("serializes into plain attributes", function () {
            obj = $form.serializeJSON();
            expect(obj).toEqual({
                name: "Bender",
                hind: "Bitable",
                shiny: true
            });
        });
    });

    describe('with nested object attributes', function () {
        beforeEach(function () {
            $form = $('<form>');
            $form.append($('<input type="text"  name="address[city]"         value="Shenzhen"/>'));
            $form.append($('<input type="text"  name="address[state][name]"  value="Guangdong"/>'));
            $form.append($('<input type="text"  name="address[state][abbr]"  value="CN"/>'));
        });

        it("serializes into nested object attributes", function () {
            obj = $form.serializeJSON();
            expect(obj).toEqual({
                address: {
                    city: "Shenzhen",
                    state: {
                        name: "Guangdong",
                        abbr: "CN"
                    }
                }
            });
        });
    });

    describe('with empty brackets (arrays)', function () {
        beforeEach(function () {
            $form = $('<form>');
            $form.append($('<input type="text"  name="hobbies[]" value="code"/>'));
            $form.append($('<input type="text"  name="hobbies[]" value="reading"/>'));
        });

        it("pushes elements into an array", function () {
            obj = $form.serializeJSON();
            expect(obj).toEqual({
                hobbies: ['code', 'reading']
            });
        });
    });


    describe('with attribute names that are integers', function () {
        beforeEach(function () {
            $form = $('<form>');
            $form.append($('<input type="text"  name="foo[0]"    value="zero"/>'));
            $form.append($('<input type="text"  name="foo[1]"    value="one"/>'));
            $form.append($('<input type="text"  name="foo[2][0]" value="two-zero"/>'));
            $form.append($('<input type="text"  name="foo[2][1]" value="two-one"/>'));
        });

        it("still creates objects with keys that are strings", function () {
            obj = $form.serializeJSON();
            expect(obj).toEqual({
                'foo': ['zero', 'one', ['two-zero', 'two-one']]
            });
        });
    });

    describe('with complext array of objects', function () {
        beforeEach(function () {
            $form = $('<form>');
            $form.append($('<input type="text"  name="projects[][name]"        value="form2json" />'));
            $form.append($('<input type="text"  name="projects[][language]"    value="javascript" />'));

            $form.append($('<input type="text"  name="projects[][name]"        value="peony" />'));
            $form.append($('<input type="text"  name="projects[][language]"    value="ruby" />'));

            $form.append($('<input type="text"  name="projects[][name]"        value="tags" />'));
            $form.append($('<input type="text"  name="projects[][languages][]" value="coffeescript" />'));
            $form.append($('<input type="text"  name="projects[][languages][]" value="javascript" />'));
        });

        it("serializes into array of objects", function () {
            obj = $form.serializeJSON();
            expect(obj).toEqual({
                projects: [
                    { name: "form2json", language: "javascript" },
                    { name: "peony", language: "ruby" },
                    { name: "tags", languages: ["coffeescript", "javascript"] },
                ]
            });
        });
    });
});
