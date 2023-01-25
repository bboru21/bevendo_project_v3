BACKEND = backend
PYTHON = $(BACKEND)/venv/bin/python3.9
FRONTEND = frontend

.PHONY = help

help:
	@echo "--------------------------HELP--------------------------"
	@echo "To serve the backend api type: 						make api"
	@echo "To serve the frontend type:            		make serve"
	@echo "--------------------------------------------------------"

api:
	$(PYTHON) $(BACKEND)/manage.py runserver 0.0.0.0:9001 --settings bevendo.config.local

serve:
	cd $(FRONTEND) && npm run dev
