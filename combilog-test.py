import logging
import combilog_handler

# Points to the Websocket Server Url hosted in the Combilog Aggregator.
url = "ws://AGG_DOMAIN:AGG_SOCKET_PORT"

# Secret of the service registered in the Combilog Dashboard
secret = "MY-SPECIAL-SECRET"

logger = logging.Logger("NamedService")
handler = combilog_handler.loghandler.CombilogHandler(aggregator_url=url, service_secret=secret)
formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
handler.setFormatter(formatter)
logger.addHandler(handler)
