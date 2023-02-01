BACKEND = backend
VENV = $(BACKEND)/venv
REQUIREMENTS = $(BACKEND)/requirements/dev.txt
PYTHON = $(VENV)/bin/python3

FRONTEND = frontend

.PHONY = help

help:
	@echo "--------------------------HELP--------------------------"
	@echo "To install the backend type: make install"
	@echo "To update the backend type: make update"
	@echo "To serve the backend api type: make api"
	@echo "To serve the frontend type: make serve"
	@echo "--------------------------------------------------------"

install:
	rm -rf $(VENV)
	python3 -m venv $(VENV)
	$(MAKE) update

update:
	( \
		source $(VENV)/bin/activate; \
		pip3 install --upgrade pip; \
		pip3 install -r $(REQUIREMENTS); \
	)

api:
	$(PYTHON) $(BACKEND)/manage.py runserver 0.0.0.0:9001 --settings bevendo.config.local

serve:
	cd $(FRONTEND) && npm run dev
